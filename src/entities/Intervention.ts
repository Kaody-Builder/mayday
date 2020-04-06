import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Equipe } from "./Equipe";
import { Signalement } from "./Signalement";
import { Rapport } from "./Rapport";

@Index("Intervention_pkey", ["idInt"], { unique: true })
@Entity("Intervention", { schema: "covid_tracker" })
export class Intervention {
  @Column("integer", { primary: true, name: "id_int" })
  idInt: number;

  @Column("date", { name: "date_int" })
  dateInt: string;

  @Column("time without time zone", { name: "heure_int" })
  heureInt: string;

  @Column("integer", { name: "etat_int" })
  etatInt: number;

  @ManyToOne(() => Equipe, (equipe) => equipe.interventions)
  @JoinColumn([{ name: "id_eq", referencedColumnName: "idEq" }])
  idEq: Equipe;

  @ManyToOne(() => Signalement, (signalement) => signalement.interventions)
  @JoinColumn([{ name: "id_sign", referencedColumnName: "idSign" }])
  idSign: Signalement;

  @OneToMany(() => Rapport, (rapport) => rapport.idInt)
  rapports: Rapport[];
}
