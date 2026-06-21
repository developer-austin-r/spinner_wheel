import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'spinner_amount' })
export class SpinnerAmount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'spinner_name', nullable: true })
  spinnerName?: string;

  @Column({ name: 'spinner_amount', type: 'double precision', nullable: true })
  spinnerAmount?: number;

  @Column({ name: 'won_color', nullable: true })
  wonColor?: string;

  @Column({ name: 'user_id', nullable: true })
  userId?: number;

  @ManyToOne(() => User, (user) => user.spinnerAmounts, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
