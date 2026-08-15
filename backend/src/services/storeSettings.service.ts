import prisma from "../config/database.js";

export async function getStoreSettings() {
  let settings = await prisma.storeSetting.findFirst();

  if (!settings) {
    settings = await prisma.storeSetting.create({
      data: {},
    });
  }

  return settings;
}


export async function updateAutoOrderProgression(enabled: boolean) {
  const settings = await getStoreSettings();

  return prisma.storeSetting.update({
    where: {
      id: settings.id,
    },
    data: {
      autoOrderProgression: enabled,
    },
  });
}