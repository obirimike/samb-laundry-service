-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'STAFF';

-- CreateTable
CREATE TABLE "BookingAssignment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "assignedById" TEXT NOT NULL,
    "unassignedById" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unassignedAt" TIMESTAMP(3),

    CONSTRAINT "BookingAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookingAssignment_bookingId_isActive_idx" ON "BookingAssignment"("bookingId", "isActive");

-- CreateIndex
CREATE INDEX "BookingAssignment_staffId_isActive_idx" ON "BookingAssignment"("staffId", "isActive");

-- CreateIndex
CREATE INDEX "BookingAssignment_assignedById_idx" ON "BookingAssignment"("assignedById");

-- CreateIndex
CREATE INDEX "BookingAssignment_unassignedById_idx" ON "BookingAssignment"("unassignedById");

-- AddForeignKey
ALTER TABLE "BookingAssignment" ADD CONSTRAINT "BookingAssignment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingAssignment" ADD CONSTRAINT "BookingAssignment_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingAssignment" ADD CONSTRAINT "BookingAssignment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingAssignment" ADD CONSTRAINT "BookingAssignment_unassignedById_fkey" FOREIGN KEY ("unassignedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
