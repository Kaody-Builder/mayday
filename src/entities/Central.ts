import { Column, Entity, Index, OneToMany } from "typeorm";
import { Equipe } from "./Equipe";

@Index("Central_pkey", ["idCent"], { unique: true })
@Entity("Central", { schema: "covid_tracker" })
export class Central {
  @Column("integer", { primary: true, name: "id_cent" })
  idCent: number;

  @Column("character varying", { name: "reg_cent", length: 255 })
  regCent: string;

  @OneToMany(() => Equipe, (equipe) => equipe.idCent)
  equipes: Equipe[];
}
