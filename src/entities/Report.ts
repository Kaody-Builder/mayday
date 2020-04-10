import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Intervention } from "./Intervention";

@Index("Report_pkey", ["idRepo"], { unique: true })
@Entity("Report")
export class Report {
    @PrimaryGeneratedColumn({
        type: "integer",
        name: "id_repo"
    })
    idRepo: number;

  @Column("timestamptz", { name: "date_repo" })
  dateRepo: string;

  @Column("integer", { name: "total_tdr_repo" })
  totalTdrRepo: number;

  @Column("integer", { name: "tdr_pos_repo" })
  tdrPosRepo: number;

  @Column("integer", { name: "tdr_neg_repo" })
  tdrNegRepo: number;

  @Column("integer", { name: "quarantaine_repo" })
  quarantaineRepo: number;

  @ManyToOne(() => Intervention, (intervention) => intervention.reports)
  @JoinColumn([{ name: "id_Inte", referencedColumnName: "idInte" }])
  idInte: Intervention;
}
