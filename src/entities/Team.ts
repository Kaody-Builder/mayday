import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Central } from "./Central";
import { Intervention } from "./Intervention";

@Index("Team_pkey", ["idTeam"], { unique: true })
@Entity("Team")
export class Team {
    @PrimaryGeneratedColumn({
        type: "integer",
        name: "id_team"
    })
    idTeam: number;

  @Column("character varying", { name: "matricule_team", length: 8 })
  matriculeTeam: string;

  @Column("character varying", { name: "pass_team", length: 250 })
  passTeam: string;

  @Column("boolean", { name: "disponibility_team" })
  disponibilityTeam: boolean;

  @ManyToOne(() => Central, (central) => central.teams)
  @JoinColumn([{ name: "id_cent", referencedColumnName: "idCent" }])
  idCent: Central;

  @OneToMany(() => Intervention, (intervention) => intervention.idTeam)
  interventions: Intervention[];
}
