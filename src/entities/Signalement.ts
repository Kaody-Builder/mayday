import { Column, Entity, Index, OneToMany } from "typeorm";
import { Intervention } from "./Intervention";
import { Reponse } from "./Reponse";

@Index("Signalement_pkey", ["idSign"], { unique: true })
@Entity("Signalement")
export class Signalement {
  @Column("integer", { primary: true, name: "id_sign" })
  idSign: number;

  @Column("character varying", { name: "position_sign", length: 255 })
  positionSign: string;

  @Column("date", { name: "date_sign" })
  dateSign: string;

  @Column("time without time zone", { name: "heure_sign" })
  heureSign: string;

  @Column("bit", { name: "type_sign" })
  typeSign: string;

  @OneToMany(() => Intervention, (intervention) => intervention.idSign)
  interventions: Intervention[];

  @OneToMany(() => Reponse, (reponse) => reponse.idSign)
  reponses: Reponse[];
}
