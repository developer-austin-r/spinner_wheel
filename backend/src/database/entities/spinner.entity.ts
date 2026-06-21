import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { SelectedSpinnerValue } from './selected-spinner-value.entity';

@Entity({ name: 'spinners' })
export class Spinner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'spinner_name' })
  spinnerName: string;

  @Column({ name: 'base_amount', type: 'double precision' })
  baseAmount: number;

  @Column({ name: 'set_amount', type: 'double precision' })
  setAmount: number;

  @Column({ name: 'user_id', nullable: true })
  userId?: number;

  @ManyToOne(() => User, (user) => user.spinners, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ name: 'active_status', default: true })
  activeStatus: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => SelectedSpinnerValue, (value) => value.spinner)
  selectedSpinnerValues: SelectedSpinnerValue[];
}
