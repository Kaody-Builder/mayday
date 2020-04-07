import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Equipe } from "./Equipe";
import { Signalement } from "./Signalement";
import { Rapport } from "./Rapport";

@Index("Intervention_pkey", ["idInt"], { unique: true })
@Entity("Intervention")
export class Intervention {
    @PrimaryGeneratedColumn({
        type: "integer",
        name: "id_int"
    })
    idInt: number;

    @Column("timestamptz", { name: "date_int" })
    dateInt: Date;

    @Column("boolean", { name: "etat_int" })
    etatInt: boolean;

    @ManyToOne(() => Equipe, (equipe) => equipe.interventions)
    @JoinColumn([{ name: "id_eq", referencedColumnName: "idEq" }])
    idEq: Equipe;

    @ManyToOne(() => Signalement, (signalement) => signalement.interventions)
    @JoinColumn([{ name: "id_sign", referencedColumnName: "idSign" }])
    idSign: Signalement;

    @OneToMany(() => Rapport, (rapport) => rapport.idInt)
    rapports: Rapport[];
}
