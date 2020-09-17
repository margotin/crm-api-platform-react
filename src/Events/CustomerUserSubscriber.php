<?php

namespace App\Events;

use App\Entity\Customer;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class CustomerUserSubscriber implements EventSubscriberInterface
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setUserForCustomer', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setUserForCustomer(ViewEvent $event): void
    {
        $object = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if($object instanceof Customer && $method === "POST")
        {
            $user = $this->security->getUser(); //Récupération de l'utilisateur connecté
            $object->setUser($user);
        }

    }
}