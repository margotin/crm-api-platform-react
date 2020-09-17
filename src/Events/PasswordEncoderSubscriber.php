<?php

namespace App\Events;

use App\Entity\User;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class PasswordEncoderSubscriber implements EventSubscriberInterface
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

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['encodePassword', EventPriorities::PRE_WRITE]
        ];
    }

    public function encodePassword(ViewEvent $event): void
    {
        $object = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if($object instanceof User && $method === "POST")
        {
            $hash = $this->encoder->encodePassword($object, $object->getPassword());
            $object->setPassword($hash);
        }
    }
}