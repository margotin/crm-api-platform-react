<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ORM\Entity(repositoryClass=UserRepository::class)
 * @ApiResource(
 *  normalizationContext={"groups"={"users_read"}}
 * )
 * @UniqueEntity(fields = {"email"},message ="Un utilisateur ayant cette adresse email existe déjà")
 */
class User implements UserInterface
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read","customers_read","invoices_subresource","users_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     * @Groups({"invoices_read","customers_read","invoices_subresource","users_read"})
     * @Assert\NotBlank(message="L'adresse email de l'utilisateur est obligatoire")
     * @Assert\Email(message="Le format de l'adresse email doit être valide")  
     */
    private $email;

    /**
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     * @Assert\NotBlank(message="Le mot de passe est obligatoire")
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoices_read","customers_read","invoices_subresource","users_read"})
     * @Assert\NotBlank(message="Le prénom du customer est obligatoire")
     * @Assert\Length(
     *  allowEmptyString =true,
     *  min=3, minMessage="Le prénom doit faire entre 3 et 255 caractères",
     *  max=255, maxMessage="Le prénom doit faire entre 3 et 255 caractères"
     * )
     */
    private $firstName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoices_read","customers_read","invoices_subresource","users_read"})
     * @Assert\NotBlank(message="Le nom du customer est obligatoire")
     * @Assert\Length(
     *  allowEmptyString =true,
     *  min=3, minMessage="Le nom doit faire entre 3 et 255 caractères",
     *  max=255, maxMessage="Le nom doit faire entre 3 et 255 caractères"
     * )
     */
    private $lastName;

    /**
     * @ORM\OneToMany(targetEntity=Customer::class, mappedBy="user")
     */
    private $customers;

    public function __construct()
    {
        $this->customers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    /**
     * @return Collection|Customer[]
     */
    public function getCustomers(): Collection
    {
        return $this->customers;
    }

    public function addCustomer(Customer $customer): self
    {
        if (!$this->customers->contains($customer)) {
            $this->customers[] = $customer;
            $customer->setUser($this);
        }

        return $this;
    }

    public function removeCustomer(Customer $customer): self
    {
        if ($this->customers->contains($customer)) {
            $this->customers->removeElement($customer);
            // set the owning side to null (unless already changed)
            if ($customer->getUser() === $this) {
                $customer->setUser(null);
            }
        }

        return $this;
    }
}
