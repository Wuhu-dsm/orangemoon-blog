import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateArticleDto } from './modules/article/dto/update-article.dto';

async function test() {
  const input = {
    title: 'Test',
    body: {
      blocks: [
        { type: 'paragraph', props: {}, content: [{ type: 'text', text: 'hello', styles: {} }] }
      ]
    }
  };

  const dto = plainToInstance(UpdateArticleDto, input);
  console.log('After plainToInstance:');
  console.log('  dto.body type:', typeof dto.body, '| constructor:', dto.body?.constructor?.name);
  console.log('  dto.body keys:', Object.keys(dto.body || {}));
  console.log('  dto.body.blocks length:', dto.body?.blocks?.length);
  console.log('  dto.body.blocks[0] type:', dto.body?.blocks?.[0]?.constructor?.name);

  const errors = await validate(dto, { whitelist: true });
  console.log('\nValidation errors count:', errors.length);
  errors.forEach((e: any) => console.log('  -', e.property, ':', Object.keys(e.constraints || {})));

  // Simulate what happens in service
  const updates = { ...dto };
  console.log('\nAfter spread (simulating service updates):');
  console.log('  updates.body type:', typeof updates.body, '| constructor:', updates.body?.constructor?.name);
  console.log('  updates.body:', JSON.stringify(updates.body, null, 2));
}

test().catch(console.error);
