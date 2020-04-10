import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./Question";
import { Distress } from './Distress';
import { Diagnostic } from './Diagnostic';

@Index("Reply_pkey", ["idRepl"], { unique: true })
@Entity("Reply")
export class Reply {
    @PrimaryGeneratedColumn({
        type: "integer",
        name: "id_repl"
    })
    idRepl: number;
  @Column("text", { name: "value_repl"})
  valueRepl: string;

  @ManyToOne(() => Question, (question) => question.replys)
  @JoinColumn([{ name: "id_ques", referencedColumnName: "idQues" }])
  idQues: Question;

  @ManyToOne(() => Diagnostic, (diagnostic) => diagnostic.idDiag)
  @JoinColumn([{ name: "id_diag", referencedColumnName: "idDiag" }])
  idDiag: Diagnostic;
}
