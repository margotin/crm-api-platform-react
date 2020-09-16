<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    /**
     * L'encodeur de mots de passe
     *
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');   
           

        for($u = 0; $u < 10; $u++) {
            $user = new User();

            $chrono = 1;
            $hash = $this->encoder->encodePassword($user, "password");

            $user->setFirstName($faker->firstName())
                ->setLastName($faker->lastName)
                ->setEmail($faker->email)
                ->setPassword($hash);

                $manager->persist($user);

            for($customer = 0; $customer < mt_rand(5,20); $customer++) {
                $newCustomer = new Customer();
                $newCustomer->setFirstName($faker->firstName())
                            ->setLastName($faker->lastName)
                            ->setCompany($faker->company)
                            ->setEmail($faker->email)
                            ->setUser($user);
    
                $manager->persist($newCustomer);
    
                for($i=0; $i< mt_rand(3,10); $i++) {
                    $invoice = new Invoice();
                    $invoice->setAmount($faker->randomFloat(2,2))
                            ->setSentAt($faker->dateTimeBetween('-6 months'))
                            ->setStatus($faker->randomElement(['SENT','PAID', 'CANCELLED']))
                            ->setCustomer($newCustomer)
                            ->setChrono($chrono);
                    
                    $chrono++;
                    $manager->persist($invoice);
                }
            }
        }

        

        $manager->flush();
    }
}
