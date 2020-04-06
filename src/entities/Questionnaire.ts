import { Column, Entity, Index, OneToMany } from "typeorm";
import { Reponse } from "./Reponse";

@Index("Questionnaire_pkey", ["idQuest"], { unique: true })
@Entity("Questionnaire", { schema: "covid_tracker" })
export class Questionnaire {
  @Column("integer", { primary: true, name: "id_quest" })
  idQuest: number;

  @Column("text", { name: "text_quest" })
  textQuest: string;

  @OneToMany(() => Reponse, (reponse) => reponse.idQuest)
  reponses: Reponse[];
}
