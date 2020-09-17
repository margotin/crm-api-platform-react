<?php

namespace App\Events;

use App\Entity\Invoice;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class InvoiceSentAtSubscriber implements EventSubscriberInterface
{   
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setSentAtForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setSentAtForInvoice(ViewEvent $event): void
    {
        $object = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if($object instanceof Invoice && $method === "POST" && empty($object->getSentAt()))
        {  
            $object->setSentAt(new \DateTime());           
        }
    }
}