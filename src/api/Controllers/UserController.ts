import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { createConnection, DeleteResult, Repository, Connection, UpdateResult } from "typeorm";
import { ormconfig } from "../../config";
import { Controller } from "../Controller";
import router from '../routerApi';
import { User } from '../../entities/User';

export default class UserController extends Controller {

    userRepository: Repository<User>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        try {
            var connection: Connection = await createConnection(ormconfig)
            this.userRepository = connection.getRepository(User)
        } catch (error) {
            console.log(error)
        }

    }

    async addPost(router: Router): Promise<void> {
        await this.postUser(router)
    }

    async addDelete(router: Router): Promise<void> {
        await this.deleteById(router);
    }

    async addGet(router: Router): Promise<void> {
        await this.getAllUser(router)
        await this.getSingleUser(router)
    }


    async addPut(router: Router): Promise<void> {
        await this.editUser(router);
    }

    private async getAllUser(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var users: User[] = await this.fetchUsersFromDatabase()
                await this.sendResponse(res, 200, { data: users })
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }

    private async fetchUsersFromDatabase(): Promise<User[]> {
        return await this.userRepository.find()
    }

    private async getSingleUser(router: Router) {
        router.get("/:id", async (req, res, next) => {
            try {
                var user: User = await this.fetchUserFromDatabase(req.params.id)
                if (await this.isUserExist(user)) {
                    await this.sendResponse(res, 200, { data: user })
                } else {
                    await this.sendResponse(res, 404, { message: "User Not Found" })
                }
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    private async fetchUserFromDatabase(id: string): Promise<User> {
        return this.userRepository.findOne(id)
    }
    private async isUserExist(user: User): Promise<boolean> {
        return user !== undefined
    }

    async postUser(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var userToSave: User = await this.createUserFromRequest(req)
                var userSaved: User = await this.saveUserToDatabase(userToSave)
                await this.sendResponse(res, 201, { message: "User Added Successfully" })
            } catch (error) {

                await this.sendResponse(res, 403, { message: "User Not Added", error: error })
            }
            next()
        })
    }
    private async createUserFromRequest(req: Request): Promise<User> {
        return this.userRepository.create(req.body as Object)
    }
    private async saveUserToDatabase(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }

    private async deleteById(router: Router): Promise<void> {
        router.delete("/:idUser", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var user: User = await this.userRepository.findOne(req.params.idUser)
                await this.userRepository.remove(user)
                res.status(202).json({ message: "deleted successfully" });
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async editUser(router: Router) {
        router.put("/:id", async (req, res, next) => {
            try {
                try {
                    var userToModify: User = await this.userRepository.findOneOrFail(req.params.id)
                } catch (error) {
                    await this.sendResponse(res, 404, { message: "User Not Found" });
                    return
                }
                try {
                    var userModifiedReadyToSave: User = await this.mergeUserFromRequest(userToModify, req);
                    await this.updateUserInDatabase(userModifiedReadyToSave);
                    await this.sendResponse(res, 200, { message: "User Modified Successfully" });
                } catch (error) {
                    await this.sendResponse(res, 403, { message: "User Not Modified", error: error });
                }
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async mergeUserFromRequest(userToModify: User, req: Request): Promise<User> {
        return this.userRepository.merge(userToModify, req.body)
    }
    private async updateUserInDatabase(userToUpdate: User): Promise<User> {
        return await this.userRepository.save(userToUpdate)
    }

}