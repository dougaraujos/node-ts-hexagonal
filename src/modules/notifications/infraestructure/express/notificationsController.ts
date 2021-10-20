import {Request, Response} from "express";
import { Container } from 'typedi';
import {validationResult} from "express-validator";

import {IDTOMapper} from "@/framework/domain/mapper/iMapper";
import NotificationDTOMap from "@/notifications/infraestructure/mapper/notificationDTOMap";
import NotificationsCrud from "@/notifications/application/notificationsCrud";
import INotificationRepository from "@/notifications/domain/repositories/iNotificationRepository";
import Criteria from "@/framework/domain/criteria/criteria";
import {IListQueryResult, orderDirection} from "@/framework/domain/criteria/iCriteria";
import Notification from "@/notifications/domain/models/notification";
import IDomainValidator from "@/framework/domain/validation/iDomainValidator";

export default class NotificationsController {

    public static async getNotifications(req: Request, res: Response): Promise<Response> {

        let repository: INotificationRepository = Container.get('notificationRepository');
        let domainValidator: IDomainValidator = Container.get('domainValidator');
        let dTOmapper: IDTOMapper<Notification> = new NotificationDTOMap(domainValidator);

        let query = req.query as {[key: string]: string};

        let criteria: Criteria = Criteria.parseFromQueryDict(query);
        if (criteria.order === undefined) {
            criteria.order = {
                orderBy: 'id',
                orderDir: orderDirection.DESC
            }
        }

        return await new NotificationsCrud(repository, dTOmapper).get(criteria)
            .then((result: IListQueryResult<Notification>) => {
                return res.json({
                    ok: true,
                    data: result,
                });
            }).catch((err) => {
                return res.status(404).json({
                    ok: false,
                });
            });
    }

    public static async notification(req: Request, res: Response): Promise<Response> {

        let repository: INotificationRepository = Container.get('notificationRepository');
        let domainValidator: IDomainValidator = Container.get('domainValidator');
        let dTOmapper: IDTOMapper<Notification> = new NotificationDTOMap(domainValidator);

        return await new NotificationsCrud(repository, dTOmapper).find(req.params.id)
            .then((notification: Notification) => {
                return res.json({
                    ok: true,
                    data: notification,
                });
            }).catch((err) => {
                return res.status(404).json({
                    ok: false,
                });
            });
    }

    public static async saveNotification(req: Request, res: Response) {

        let repository: INotificationRepository = Container.get('notificationRepository');
        let domainValidator: IDomainValidator = Container.get('domainValidator');
        let dTOmapper: IDTOMapper<Notification> = new NotificationDTOMap(domainValidator);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                ok: false,
                errors: errors.mapped()
            });
        }

        return await new NotificationsCrud(repository, dTOmapper).save(req.body)
            .then((notification: Notification) => {
                return res.json({
                    ok: true,
                    data: notification,
                });
            }).catch((err) => {
                return res.status(422).json({
                    ok: false,
                    errors: err.message
                });
            });

    }

    public static async updateNotification(req: Request, res: Response) {

        let repository: INotificationRepository = Container.get('notificationRepository');
        let domainValidator: IDomainValidator = Container.get('domainValidator');
        let dTOmapper: IDTOMapper<Notification> = new NotificationDTOMap(domainValidator);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                ok: false,
                errors: errors.array()
            });
        }

        return await new NotificationsCrud(repository, dTOmapper).update(req.params.id, req.body)
            .then((notification: Notification) => {
                return res.json({
                    ok: true,
                    data: notification,
                });
            }).catch((err) => {
                return res.status(422).json({
                    ok: false,
                    errors: err.message
                });
            });

    }

    /*public static deleteNotification(req: Request, res: Response) {

        Notification.find(req.params.id, (err: string, result: INotification) => {
            if (err) {
                console.error(err);
                return res.status(404).json({
                    ok: false,
                });
            }

            let notification = new Notification(result);

            notification.delete((err: string, result: OkPacket) => {
                if (err) {
                    console.error(err);
                    return res.status(400).json({
                        ok: false,
                    });
                }

                res.json({
                    ok: true
                });

            });

        });

    }*/

}