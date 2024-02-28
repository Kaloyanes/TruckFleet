
import { serverSupabaseClient } from '#supabase/server';
import { TestModel } from '~/models/test';

export default defineEventHandler(async (event) => {
  let client = await serverSupabaseClient(event);
  let { data, error } = await client.from('countries').select('*');

  if (error) {
    return { status: 500, body: error };
  }

  return data as TestModel[];
})
