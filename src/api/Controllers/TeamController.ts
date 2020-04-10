import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { createConnection, DeleteResult, Repository, Connection, UpdateResult } from "typeorm";
import { ormconfig } from "../../config";
import { Controller } from "../Controller";
import router from '../routerApi';
import { Team } from '../../entities/Team';

export default class TeamController extends Controller {

    teamRepository: Repository<Team>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        try {
            var connection: Connection = await createConnection(ormconfig)
            this.teamRepository = connection.getRepository(Team)
        } catch (error) {
            console.log(error)
        }

    }

    async addPost(router: Router): Promise<void> {
        await this.postTeam(router)
    }

    async addDelete(router: Router): Promise<void> {
        await this.deleteById(router);
    }

    async addGet(router: Router): Promise<void> {
        await this.getAllTeam(router)
        await this.getSingleTeam(router)
    }


    async addPut(router: Router): Promise<void> {
        await this.editTeam(router);
    }

    private async getAllTeam(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var teams: Team[] = await this.fetchTeamsFromDatabase()
                await this.sendResponse(res, 200, { data: teams })
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }

    private async fetchTeamsFromDatabase(): Promise<Team[]> {
        return await this.teamRepository.find()
    }

    private async getSingleTeam(router: Router) {
        router.get("/:id", async (req, res, next) => {
            try {
                var team: Team = await this.fetchTeamFromDatabase(req.params.id)
                if (await this.isTeamExist(team)) {
                    await this.sendResponse(res, 200, { data: team })
                } else {
                    await this.sendResponse(res, 404, { message: "Team Not Found" })
                }
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    private async fetchTeamFromDatabase(id: string): Promise<Team> {
        return this.teamRepository.findOne(id)
    }
    private async isTeamExist(team: Team): Promise<boolean> {
        return team !== undefined
    }

    async postTeam(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var teamToSave: Team = await this.createTeamFromRequest(req)
                var teamSaved: Team = await this.saveTeamToDatabase(teamToSave)
                await this.sendResponse(res, 201, { message: "Team Added Successfully" })
            } catch (error) {

                await this.sendResponse(res, 403, { message: "Team Not Added", error: error })
            }
            next()
        })
    }
    private async createTeamFromRequest(req: Request): Promise<Team> {
        return this.teamRepository.create(req.body as Object)
    }
    private async saveTeamToDatabase(team: Team): Promise<Team> {
        return await this.teamRepository.save(team);
    }

    private async deleteById(router: Router): Promise<void> {
        router.delete("/:idTeam", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var team: Team = await this.teamRepository.findOne(req.params.idTeam)
                await this.teamRepository.remove(team)
                res.status(202).json({ message: "deleted successfully" });
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async editTeam(router: Router) {
        router.put("/:id", async (req, res, next) => {
            try {
                try {
                    var teamToModify: Team = await this.teamRepository.findOneOrFail(req.params.id)
                } catch (error) {
                    await this.sendResponse(res, 404, { message: "Team Not Found" });
                    return
                }
                try {
                    var teamModifiedReadyToSave: Team = await this.mergeTeamFromRequest(teamToModify, req);
                    await this.updateTeamInDatabase(teamModifiedReadyToSave);
                    await this.sendResponse(res, 200, { message: "Team Modified Successfully" });
                } catch (error) {
                    await this.sendResponse(res, 403, { message: "Team Not Modified", error: error });
                }
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async mergeTeamFromRequest(teamToModify: Team, req: Request): Promise<Team> {
        return this.teamRepository.merge(teamToModify, req.body)
    }
    private async updateTeamInDatabase(teamToUpdate: Team): Promise<Team> {
        return await this.teamRepository.save(teamToUpdate)
    }

}