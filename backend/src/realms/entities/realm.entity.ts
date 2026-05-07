import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export interface RealmData {
  spawnpoint: {
    roomIndex: number;
    x: number;
    y: number;
  };
  rooms: Room[];
}

export interface Room {
  name: string;
  tilemap: {
    [key: `${number}, ${number}`]: {
      floor?: string;
      above_floor?: string;
      object?: string;
      impassable?: boolean;
      teleporter?: {
        roomIndex: number;
        x: number;
        y: number;
      };
    };
  };
  channelId?: string;
}

@Entity('realms')
export class Realm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  owner_id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'uuid', unique: true })
  share_id: string;

  @Column({ type: 'jsonb' })
  map_data: RealmData;

  @Column({ type: 'boolean', default: false })
  only_owner: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'owner_id' })
  owner: User;
}
