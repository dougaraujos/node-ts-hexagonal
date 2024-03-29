import {IDomainEvent} from "@/shared/modules/shared/domain/aggregate/iDomainEvent";
import IDomainValidator from "@/shared/modules/shared/domain/validation/iDomainValidator";
import ValidatorJS from "@/shared/modules/shared/infrastructure/validation/validatorjs/validatorJS";

export abstract class AggregateRoot {

    private _domainEvents: IDomainEvent[] = [];
    protected validator: IDomainValidator = new ValidatorJS();

    get domainEvents(): IDomainEvent[] {
        return this._domainEvents;
    }

    protected addDomainEvent(domainEvent: IDomainEvent): void {
        this._domainEvents.push(domainEvent);

        this.logDomainEventAdded(domainEvent);
    }

    public clearEvents (): void {
        this._domainEvents.splice(0, this._domainEvents.length);
    }

    private logDomainEventAdded (domainEvent: IDomainEvent): void {
        const thisClass = Reflect.getPrototypeOf(this);
        const domainEventClass = Reflect.getPrototypeOf(domainEvent);
        console.info(`[Domain Event Created]:`, thisClass.constructor.name, '==>', domainEventClass.constructor.name)
    }

}
