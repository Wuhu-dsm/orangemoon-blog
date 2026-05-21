import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { User, UserSchema } from '../modules/user/schemas/user.schema';

type SeedOptions = {
  email: string;
  username: string;
  password: string;
  mongodbUri: string;
};

function hasCliOption(name: string): boolean {
  const flag = `--${name}`;
  const inlinePrefix = `${flag}=`;

  return process.argv.some((arg) => arg === flag || arg.startsWith(inlinePrefix));
}

function readOption(name: string, envName: string): string | undefined {
  const flag = `--${name}`;
  const inlinePrefix = `${flag}=`;
  const inlineArg = process.argv.find((arg) => arg.startsWith(inlinePrefix));

  if (inlineArg) {
    return inlineArg.slice(inlinePrefix.length);
  }

  const index = process.argv.indexOf(flag);

  if (index >= 0) {
    return process.argv[index + 1];
  }

  return process.env[envName];
}

function loadOptions(): SeedOptions {
  const email = readOption('email', 'OWNER_EMAIL');
  const username = readOption('username', 'OWNER_USERNAME');
  const password = process.env.OWNER_PASSWORD;
  const mongodbUri =
    readOption('mongodb-uri', 'MONGODB_URI') ??
    'mongodb://localhost:27017/sorablog';

  if (hasCliOption('password')) {
    throw new Error(
      'Use OWNER_PASSWORD instead of --password so npm does not echo the secret.',
    );
  }

  const missing = [
    !email && '--email or OWNER_EMAIL',
    !username && '--username or OWNER_USERNAME',
    !password && 'OWNER_PASSWORD',
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(`Missing required owner seed input: ${missing.join(', ')}`);
  }

  if (password!.length < 8) {
    throw new Error('Owner password must be at least 8 characters long');
  }

  return {
    email: email!,
    username: username!,
    password: password!,
    mongodbUri,
  };
}

async function seed() {
  const options = loadOptions();
  await mongoose.connect(options.mongodbUri);

  const UserModel = mongoose.model(User.name, UserSchema);
  const password = await bcrypt.hash(options.password, 10);

  await UserModel.findOneAndUpdate(
    { $or: [{ email: options.email }, { username: options.username }] },
    {
      $set: {
        email: options.email,
        username: options.username,
        password,
        role: 'admin',
        status: 'active',
      },
      $setOnInsert: {
        refreshTokenVersion: 0,
        level: 1,
        exp: 0,
      },
    },
    { returnDocument: 'after', upsert: true },
  ).exec();

  console.log(
    `Owner account seeded: email=${options.email}, username=${options.username}`,
  );
}

seed()
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Owner seed failed: ${message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
