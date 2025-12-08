/**
 * @file app/repositories/pushSubscription.repository.js
 * @description pushSubscription Repository
 * 251208 v1.0.0 mastercat init
 */

import db from '../models/index.js';
const { Push_subscription } = db;

async function upsert(t = null, data) {
  return await Push_subscription.upsert(data, { transaction : t });
}

export default {
  upsert,
}