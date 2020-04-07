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

@Index("Equipe_pkey", ["idEq"], { unique: true })
@Entity("Equipe")
export class Equipe {
    @PrimaryGeneratedColumn({
        type: "integer",
        name: "id_eq"
    })
    idEq: number;

  @Column("character varying", { name: "matricule_eq", length: 8 })
  matriculeEq: string;

  @Column("integer", { name: "nombre_eq" })
  nombreEq: number;

  @Column("integer", { name: "nombre_pat_eq" })
  nombrePatEq: number;

  @ManyToOne(() => Central, (central) => central.equipes)
  @JoinColumn([{ name: "id_cent", referencedColumnName: "idCent" }])
  idCent: Central;

  @OneToMany(() => Intervention, (intervention) => intervention.idEq)
  interventions: Intervention[];
}
