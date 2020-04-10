import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Reply } from "./Reply";
import { Option } from './Option';

@Index("Question_pkey", ["idQues"], { unique: true })
@Entity("Question")
export class Question {
    @PrimaryGeneratedColumn({
        type: "integer",
        name: "id_ques"
    })
    idQues: number;

    @Column("text", { name: "text_ques" })
    textQues: string;

    @Column("boolean", { name: "type_ques" })
    typeQues: boolean;

    @OneToMany(() => Reply, (reply) => reply.idRepl)
    replys: Reply[];

    @OneToMany(() => Option, (option) => option.idOpti)
    options: Option[];
}
