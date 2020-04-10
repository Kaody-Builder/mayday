import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Team } from "./Team";
import { Report } from "./Report";
import { Distress } from './Distress';

@Index("Intervention_pkey", ["idInte"], { unique: true })
@Entity("Intervention")
export class Intervention {
    @PrimaryGeneratedColumn({
        type: "integer",
        name: "id_inte"
    })
    idInte: number;

    @Column("timestamptz", { name: "date_inte" })
    dateInte: Date;

    @ManyToOne(() => Team, (team) => team.interventions)
    @JoinColumn([{ name: "id_team", referencedColumnName: "idTeam" }])
    idTeam: Team;

    @ManyToOne(() => Distress, (distress) => distress.idDist)
    @JoinColumn([{ name: "id_dist", referencedColumnName: "idDist" }])
    idDist: Distress;

    @OneToMany(() => Report, (report) => report.idRepo)
    reports: Report[];
}
