import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Questionnaire } from "./Questionnaire";
import { Signalement } from "./Signalement";

@Index("Reponse_pkey", ["idRep"], { unique: true })
@Entity("Reponse")
export class Reponse {
  @Column("integer", { primary: true, name: "id_rep" })
  idRep: number;

  @Column("character varying", { name: "valeur_rep", length: 10 })
  valeurRep: string;

  @ManyToOne(() => Questionnaire, (questionnaire) => questionnaire.reponses)
  @JoinColumn([{ name: "id_quest", referencedColumnName: "idQuest" }])
  idQuest: Questionnaire;

  @ManyToOne(() => Signalement, (signalement) => signalement.reponses)
  @JoinColumn([{ name: "id_sign", referencedColumnName: "idSign" }])
  idSign: Signalement;
}
