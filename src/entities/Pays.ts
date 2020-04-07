import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Equipe } from "./Equipe";
import { Central } from './Central';

@Index("Pays_pkey", ["idPays"], { unique: true })
@Entity("Pays")
export class Pays {
    @PrimaryGeneratedColumn({
        type: "integer",
        name: "id_pays"
    })
    idPays: number;

    @Column("character varying", { name: "nom_pays", length: 255 })
    nomPays: string;

    @OneToMany(() => Equipe, (equipe) => equipe.idCent)
    central: Central[];
}
