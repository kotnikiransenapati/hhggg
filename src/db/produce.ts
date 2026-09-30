import { db } from './index.ts';
import { produceItems, farmClusters } from './schema.ts';
import { INITIAL_PRODUCE, REGIONAL_CLUSTERS } from '../data/mockData.ts';
import { ProduceItem, FarmCluster } from '../types.ts';

export async function getProduceItems(): Promise<ProduceItem[]> {
  try {
    const rows = await db.select().from(produceItems);
    if (rows.length === 0) {
      // Seed default items if empty
      await seedDefaultData();
      return INITIAL_PRODUCE;
    }
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category as any,
      badge: r.badge,
      batchId: r.batchId,
      imageUrl: r.imageUrl,
      harvestTime: r.harvestTime,
      harvestHoursAgo: 4,
      origin: r.origin,
      farmer: r.farmer,
      price: r.price,
      unit: r.unit,
      growerSharePercent: r.growerSharePercent,
      accreditation: ['PGS-India Organic Certified'],
      distanceKm: r.distanceKm,
      inStock: Boolean(r.inStock),
    }));
  } catch (error) {
    console.error('Error fetching produce items from DB, falling back to initial data:', error);
    return INITIAL_PRODUCE;
  }
}

export async function getFarmClusters(): Promise<FarmCluster[]> {
  try {
    const rows = await db.select().from(farmClusters);
    if (rows.length === 0) {
      return REGIONAL_CLUSTERS;
    }
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      region: r.region,
      pin: r.pin,
      status: r.status as any,
      farmersCount: r.farmersCount,
      crops: ['Seasonal Organic Crops'],
      acreage: 180,
      soilNpk: r.soilNpk,
      coordinates: '19.9975° N, 73.7898° E',
      transitHours: 4.5,
      leadFarmer: r.leadFarmer,
      leadFarmerAvatar: r.leadFarmerAvatar,
      bio: r.bio,
      chemicalResiduePpm: Number(r.chemicalResiduePpm) || 0.0,
      humusPercent: 1.45,
    }));
  } catch (error) {
    console.error('Error fetching farm clusters from DB:', error);
    return REGIONAL_CLUSTERS;
  }
}

export async function seedDefaultData() {
  try {
    const existing = await db.select().from(produceItems);
    if (existing.length === 0) {
      await db.insert(produceItems).values(
        INITIAL_PRODUCE.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          badge: p.badge,
          batchId: p.batchId,
          imageUrl: p.imageUrl,
          harvestTime: p.harvestTime,
          origin: p.origin,
          farmer: p.farmer,
          price: Math.round(p.price),
          unit: p.unit,
          growerSharePercent: p.growerSharePercent,
          distanceKm: p.distanceKm,
          inStock: p.inStock ? 1 : 0,
        }))
      );
    }

    const existingClusters = await db.select().from(farmClusters);
    if (existingClusters.length === 0) {
      await db.insert(farmClusters).values(
        REGIONAL_CLUSTERS.map((c) => ({
          id: c.id,
          name: c.name,
          region: c.region,
          pin: c.pin,
          status: c.status,
          farmersCount: c.farmersCount,
          leadFarmer: c.leadFarmer,
          leadFarmerAvatar: c.leadFarmerAvatar,
          bio: c.bio,
          soilNpk: c.soilNpk,
          chemicalResiduePpm: '0.00',
        }))
      );
    }
  } catch (error) {
    console.error('Seeding default data failed:', error);
  }
}
