import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Question } from './Question';

@Entity("Option")
export class Option {
    @PrimaryGeneratedColumn({
        type: "integer",
        name: "id_opti"
    })
    idOpti: number;

    @Column("bit", { name: "type_opti" })
    typeOpti: number;

    @Column("character varying", { name: "valeur_opti", length: 50 })
    valeurOpti: string;

    @ManyToOne(() => Question, (question) => question.idQues)
    question: Question;
}