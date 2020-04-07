import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Intervention } from "./Intervention";

@Index("Rapport_pkey", ["idRap"], { unique: true })
@Entity("Rapport")
export class Rapport {
    @PrimaryGeneratedColumn({
        type: "integer",
        name: "id_rap"
    })
    idRap: number;

  @Column("date", { name: "date_rap" })
  dateRap: string;

  @Column("time without time zone", { name: "heure_rap" })
  heureRap: string;

  @Column("integer", { name: "nb_tdr_rap" })
  nbTdrRap: number;

  @Column("integer", { name: "nb_tdr_pos_rap" })
  nbTdrPosRap: number;

  @Column("integer", { name: "ng_tdr_neg_rap" })
  ngTdrNegRap: number;

  @Column("integer", { name: "nb_cas_ramas_rap" })
  nbCasRamasRap: number;

  @ManyToOne(() => Intervention, (intervention) => intervention.rapports)
  @JoinColumn([{ name: "id_int", referencedColumnName: "idInt" }])
  idInt: Intervention;
}
