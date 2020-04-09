import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, ManyToOne, ValueTransformer } from "typeorm";
import { Equipe } from "./Equipe";
import { Pays } from './Pays';
import { Central } from './Central';

@Index("Attente_pkey", ["idCent"], { unique: true })
@Entity("Attente")
export class Attente {
    @Column({
        type: "character varying",
        name: "num_tel",
        length: 15,
        primary: true
    })
    numTel: string;

    @Column({
        type: 'geography',
        nullable: false,
        spatialFeatureType: 'Point',
        srid: 4326,
        name: "coord_att"
    })
    coordAtt: string;

    @Column('character varying',{
        nullable: false,
        length: "10",
        name: "code_att"
    })
    codeAtt: string;

    @Column({
        type: 'character varying',
        length: "30",
        nullable: true,
        name: "photo_att"
    })
    photoAtt: string;

    @ManyToOne(() => Central, (central) => central.idCent)
    idCent:Central
}
