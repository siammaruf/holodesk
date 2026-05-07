import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Realm } from '../../realms/entities/realm.entity';

@Entity('realm_embeddings')
export class RealmEmbedding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  realm_id: string;

  @Column({ type: 'varchar', length: 50 })
  content_type: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text' })
  embedding: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ManyToOne(() => Realm, (realm) => realm.id)
  @JoinColumn({ name: 'realm_id' })
  realm: Realm;
}
