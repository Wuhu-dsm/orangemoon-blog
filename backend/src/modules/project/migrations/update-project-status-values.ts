import { connect, disconnect, model, Schema, type Model } from 'mongoose';
import { ProjectStatus } from '../enums/project-status.enum';
import { Project } from '../schemas/project.schema';

type LegacyProjectStatus =
  | 'planning'
  | 'in-progress'
  | 'completed'
  | 'maintenance';

type ProjectStatusMigrationModel = {
  updateMany(
    filter: { projectStatus: LegacyProjectStatus },
    update: { $set: { projectStatus: ProjectStatus } },
  ): Promise<{ modifiedCount: number }>;
};

const OLD_TO_NEW = {
  planning: ProjectStatus.Pending,
  'in-progress': ProjectStatus.Developing,
  completed: ProjectStatus.Updating,
  maintenance: ProjectStatus.Archived,
};

const STATUS_MIGRATIONS = Object.entries(OLD_TO_NEW) as Array<
  [LegacyProjectStatus, ProjectStatus]
>;

export async function migrateProjectStatuses(
  projectModel: Model<Project>,
): Promise<void> {
  const migrationModel = projectModel as unknown as ProjectStatusMigrationModel;
  let totalUpdated = 0;

  for (const [oldStatus, newStatus] of STATUS_MIGRATIONS) {
    const result = await migrationModel.updateMany(
      { projectStatus: oldStatus },
      { $set: { projectStatus: newStatus } },
    );
    totalUpdated += result.modifiedCount;
  }

  console.log(`Migration complete: ${totalUpdated} projects updated`);
}

// Standalone execution via npx ts-node
if (require.main === module) {
  async function run() {
    const mongoUri =
      process.env.MONGO_URI || 'mongodb://localhost:27017/orangemoon';
    await connect(mongoUri);

    const projectModel = model<Project>(
      'Project',
      new Schema<Project>({}, { strict: false, collection: 'projects' }),
    );

    await migrateProjectStatuses(projectModel);
    await disconnect();
  }

  run().catch((err: Error) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
}
