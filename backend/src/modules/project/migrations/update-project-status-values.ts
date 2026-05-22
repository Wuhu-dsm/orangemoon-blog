import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from '../schemas/project.schema';

const OLD_TO_NEW: Record<string, string> = {
  planning: 'pending',
  'in-progress': 'developing',
  completed: 'updating',
  maintenance: 'archived',
};

export async function migrateProjectStatuses(
  projectModel: Model<Project>,
): Promise<void> {
  let totalUpdated = 0;

  for (const [oldStatus, newStatus] of Object.entries(OLD_TO_NEW)) {
    const result = await projectModel.updateMany(
      { projectStatus: oldStatus },
      { $set: { projectStatus: newStatus } },
    );
    totalUpdated += result.modifiedCount;
  }

  console.log(`Migration complete: ${totalUpdated} projects updated`);
}

// Standalone execution via npx ts-node
if (require.main === module) {
  const mongoose = require('mongoose');

  async function run() {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/orangemoon';
    await mongoose.connect(mongoUri);

    const projectModel = mongoose.model(
      'Project',
      new mongoose.Schema({}, { strict: false, collection: 'projects' }),
    );

    await migrateProjectStatuses(projectModel);
    await mongoose.disconnect();
  }

  run().catch((err: Error) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
}
