import * as repo from "../src/api/v1/repositories/firestoreRepository";
import * as service from "../src/api/v1/services/eventService";

jest.mock("../src/api/v1/repositories/firestoreRepository");

const mockedRepo = repo as jest.Mocked<typeof repo>;

describe("eventService", () => {
  beforeEach(() => jest.clearAllMocks());

  it("createEvent should call createDocument", async () => {
    mockedRepo.getAllDocuments.mockResolvedValueOnce([] as any);
    mockedRepo.createDocument.mockResolvedValueOnce("evt_000001");

    const created = await service.createEvent({
      name: "Test",
      date: "2025-12-25T09:00:00.000Z",
      capacity: 10,
    });

    expect(mockedRepo.createDocument).toHaveBeenCalled();
    expect(created.id).toBe("evt_000001");
  });

  it("getAllEvents should call getAllDocuments", async () => {
    mockedRepo.getAllDocuments.mockResolvedValueOnce([] as any);
    const events = await service.getAllEvents();
    expect(mockedRepo.getAllDocuments).toHaveBeenCalled();
    expect(events).toEqual([]);
  });

  it("getEventById should throw when not found", async () => {
    mockedRepo.getDocById.mockResolvedValueOnce(null as any);
    await expect(service.getEventById("evt_000999")).rejects.toThrow("Event not found");
  });

  it("updateEvent should call updateDocument", async () => {
    mockedRepo.getDocById
      .mockResolvedValueOnce({ id: "evt_000001" } as any)
      .mockResolvedValueOnce({ id: "evt_000001", name: "Updated" } as any);

    mockedRepo.updateDocument.mockResolvedValueOnce();

    const updated = await service.updateEvent("evt_000001", { name: "Updated" });
    expect(mockedRepo.updateDocument).toHaveBeenCalled();
    expect(updated.name).toBe("Updated");
  });

  it("deleteEvent should call deleteDocument", async () => {
    mockedRepo.getDocById.mockResolvedValueOnce({ id: "evt_000001" } as any);
    mockedRepo.deleteDocument.mockResolvedValueOnce();

    await service.deleteEvent("evt_000001");
    expect(mockedRepo.deleteDocument).toHaveBeenCalledWith("events", "evt_000001");
  });
});