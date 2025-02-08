"use server";

import prisma from "@/lib/db";
import { CreateAccountProps, CreateRecordProps } from "@/types";

export const getAccounts = async (userId: string) => {
  try {
    const accounts = await prisma.account.findMany({
      where: {
        holderId: userId,
      },
      select: {
        id: true,
        counterEntityName: true,
      },
    });
    return accounts;
  } catch (error: any) {
    return console.log(error.msg || error, "GET_ACCOUNTS_ERROR");
  }
};

export const createAccount = async (data: CreateAccountProps) => {
  try {
    const { holderId, amount, type, counterEntityName, recordHolder, settled } =
      data;
    const finalCounterEntityName = counterEntityName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    if (!holderId || !amount || !type || !counterEntityName) {
      return {
        msg: "Invalid inputs provided",
        success: false,
      };
    }
    const existingAccount = await prisma.account.findMany({
      where: {
        counterEntityName: finalCounterEntityName,
        holderId,
      },
    });
    if (existingAccount[0]) {
      return {
        msg: "Account name already exists, please create a unique name to avoid confusion",
        success: false,
      };
    }
    await prisma.account.create({
      data: {
        counterEntityName: finalCounterEntityName,
        holderId,
        records: {
          create: {
            amount,
            type,
            recordHolder,
            settled,
          },
        },
      },
    });
    return {
      msg: "Account created",
      success: true,
    };
  } catch (error: any) {
    console.log(error.msg || error, "ACCOUNT_CREATE_ERROR");
    return {
      msg: "Internal server error",
      success: false,
    };
  }
};

export const createRecord = async (data: CreateRecordProps) => {
  try {
    const { recordHolder, counterEntityId, amount, type, settled } = data;
    if (!counterEntityId || !amount || !type) {
      return {
        msg: "Invalid inputs provided",
        success: false,
      };
    }
    await prisma.record.create({
      data: {
        amount,
        type,
        recordHolder,
        counterEntityId,
        settled,
      },
    });
    return {
      msg: "Record created",
      success: true,
    };
  } catch (error: any) {
    console.log(error.msg || error, "RECORD_CREATE_ERROR");
    return {
      msg: "Some error occured",
      success: false,
    };
  }
};

export const getAccountById = async (accountId: string) => {
  try {
    if (!accountId) {
      return {
        msg: "Invalid request",
        success: false,
      };
    }
    const account = await prisma.account.findUnique({
      where: {
        id: accountId,
      },
      include: {
        records: {
          select: {
            amount: true,
            recordHolder: true,
            createdAt: true,
            type: true,
            settled: true,
            id: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    if (!account) {
      return {
        msg: "Invalid request",
        success: false,
      };
    }
    return {
      msg: "Account found",
      success: true,
      account,
    };
  } catch (error: any) {
    console.log(error.msg || error, "GET_ACCOUNT_BY_ID_ERROR");
    return {
      msg: "Internal server error",
      success: false,
    };
  }
};

export const changeSettled = async (settled: boolean, recordId: string) => {
  try {
    await prisma.record.update({
      where: {
        id: recordId,
      },
      data: {
        settled,
      },
    });
    return {
      msg: "Request successful",
      success: true,
    };
  } catch (error: any) {
    console.log(error.msg || error, "SETTLED_ERROR");
    return {
      msg: "Internal server error",
      success: false,
    };
  }
};

export const getAllRecords = async (userId: string) => {
  try {
    const records = await prisma.account.findMany({
      where: {
        holderId: userId,
      },
      select: {
        records: {
          select: {
            amount: true,
            settled: true,
            type: true,
          },
        },
      },
    });
    const finalRecords = records.flatMap((record) => {
      return record.records;
    });
    if (!finalRecords) {
      return {
        msg: "Records not found",
        success: true,
      };
    }
    return {
      msg: "Records fetched",
      success: true,
      records: finalRecords,
    };
  } catch (error: any) {
    console.log(error.msg || error, "GET_RECORDS_ERROR");
    return {
      msg: "Internal server error",
      success: false,
    };
  }
};

export const fetchSearchResults = async (
  searchItem: string,
  userId: string
) => {
  try {
    if (searchItem.length < 1) {
      return {
        msg: "Invalid request",
        success: false,
      };
    }
    const searchResults = await prisma.account.findMany({
      where: {
        holderId: userId,
        counterEntityName: {
          contains: searchItem,
          mode: "insensitive",
        },
      },
      select: {
        counterEntityName: true,
        id: true,
      },
    });
    if (searchResults.length < 1 || !searchResults) {
      return {
        msg: "No accounts found",
        success: true,
      };
    }
    return {
      msg: "Accounts found",
      success: true,
      results: searchResults,
    };
  } catch (error: any) {
    console.log(error.msg || error, "FETCH_SEARCH_RESULTS_ERROR");
    return {
      msg: "Internal server error",
      success: false,
    };
  }
};

export const deleteAccount = async (accountId: string) => {
  try {
    if (!accountId) {
      return {
        msg: "Invalid request",
        success: false,
      };
    }
    await prisma.account.delete({
      where: {
        id: accountId,
      },
    });
    return {
      msg: "Account deleted",
      success: true,
    };
  } catch (error: any) {
    console.log(error.msg || error, "DELETE_ACCOUNT_ERROR");
    return {
      msg: "Internal server error",
      success: false,
    };
  }
};

export const deleteRecord = async (recordId: string) => {
  try {
    if (!recordId) {
      return {
        msg: "Invalid request",
        success: false,
      };
    }
    const record = await prisma.record.delete({
      where: {
        id: recordId,
      },
      select: {
        counterEntityId: true,
      },
    });
    const account = await prisma.account.findUnique({
      where: {
        id: record.counterEntityId,
      },
      select: {
        _count: {
          select: {
            records: true,
          },
        },
      },
    });
    let accountDelete = false;
    if (account?._count.records === 0) {
      await prisma.account.delete({
        where: {
          id: record.counterEntityId,
        },
      });
      accountDelete = true;
    }
    return {
      msg: "Record deleted",
      success: true,
      accountDelete,
    };
  } catch (error: any) {
    console.log(error.msg || error, "DELETE_RECORD_ERROR");
    return {
      msg: "Internal server error",
      success: false,
    };
  }
};
