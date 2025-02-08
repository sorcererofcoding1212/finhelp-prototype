import { Type } from "@prisma/client";

export interface CreateAccountProps {
  holderId: string;
  type: Type;
  counterEntityName: string;
  amount: number;
  recordHolder?: string;
  id?: string;
  settled?: boolean;
}

export interface CreateRecordProps {
  counterEntityId: string;
  type: Type;
  amount: number;
  recordHolder?: string;
  settled?: boolean;
}
