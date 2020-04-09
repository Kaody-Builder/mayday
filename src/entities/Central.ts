import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, ManyToOne, ValueTransformer } from "typeorm";
import { Equipe } from "./Equipe";
import { Pays } from './Pays';
import { Attente } from './Attente';

@Index("Central_pkey", ["idCent"], { unique: true })
@Entity("Central")
export class Central {
    @PrimaryGeneratedColumn({
        type: "integer",
        name: "id_cent"
    })
    idCent: number;

    @Column({
        type: 'geography',
        nullable: false,
        spatialFeatureType: 'Point',
        srid: 4326,
        name: "coord_cent"
    })
    coordCent: string;

    @Column('character varying',{
        nullable: false,
        length: "20",
        name: "login_cent"
    })
    loginCent: string;

    @Column({
        type: 'text',
        nullable: false,
        name: "pass_cent"
    })
    passCent: string;

    @OneToMany(() => Equipe, (equipe) => equipe.idCent)
    equipes: Equipe[];

    @OneToMany(() => Attente, (attente) => attente.numTel)
    attentes: Attente[];
    
    @ManyToOne(() => Pays, (pays) => pays.idPays)
    pays:Pays
}
