import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Spinner } from './spinner.entity';
import { SpinnerColor } from './spinner-color.entity';
import { User } from './user.entity';

@Entity({ name: 'selected_spinner_values' })
export class SelectedSpinnerValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'selected_color' })
  selectedColor: number;

  @Column({ type: 'varchar', length: 255 })
  amount: string;

  @Column({ name: 'spinner_id' })
  spinnerId: number;

  @ManyToOne(() => User, (user) => user.selectedSpinnerValues, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => SpinnerColor, (color) => color.selectedSpinnerValues, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'selected_color' })
  color: SpinnerColor;

  @ManyToOne(() => Spinner, (spinner) => spinner.selectedSpinnerValues, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'spinner_id' })
  spinner: Spinner;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
