import { getUser } from "../../lib/auth-session";
import { CreateClientSchema, UpdateClientSchema } from "@/features/Clients/server/clients.schema";
import { ClientsRepository } from "../repositories/clients.repository";

export async function listClients() {
  const user = await getUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return ClientsRepository.findAllByUser(user.id);
}

export async function getClient(id: string) {
  const user = await getUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const client = await ClientsRepository.findById(id);
  if (!client) throw new Error("NOT_FOUND");
  if (client.userId !== user.id) throw new Error("FORBIDDEN");
  return client;
}

export async function createClient(input: unknown) {
  const user = await getUser();
  if (!user) throw new Error("UNAUTHORIZED");

  const data = CreateClientSchema.parse(input);

  const siret = data.siret?.trim() || null;
  const email = data.email?.trim() || null;

  if (siret) {
    const existing = await ClientsRepository.findByUserAndSiret(user.id, siret);
    if (existing) throw new Error("SIRET_ALREADY_EXISTS");
  }

  if (email) {
    const existing = await ClientsRepository.findByUserAndEmail(user.id, email);
    if (existing) throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const created = await ClientsRepository.create(user.id, data);
  return { id: created.id };
}

export async function updateClient(id: string, input: unknown) {
  const user = await getUser();
  if (!user) throw new Error("UNAUTHORIZED");

  const client = await ClientsRepository.findById(id);
  if (!client) throw new Error("NOT_FOUND");
  if (client.userId !== user.id) throw new Error("FORBIDDEN");

  const data = UpdateClientSchema.parse(input);
  return ClientsRepository.update(id, data);
}

export async function toggleClient(id: string) {
  const user = await getUser();
  if (!user) throw new Error("UNAUTHORIZED");

  const client = await ClientsRepository.findById(id);
  if (!client) throw new Error("NOT_FOUND");
  if (client.userId !== user.id) throw new Error("FORBIDDEN");

  return ClientsRepository.toggleActive(id, client.isActive);
}

export async function deleteClient(id: string) {
  const user = await getUser();
  if (!user) throw new Error("UNAUTHORIZED");

  const client = await ClientsRepository.findById(id);
  if (!client) throw new Error("NOT_FOUND");
  if (client.userId !== user.id) throw new Error("FORBIDDEN");

  return ClientsRepository.remove(id);
}
