export const TicketQueue = {
    type: 'object',
    properties: {
        ticketQueueId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },

        parentQueueId: { type: 'long' },
        name: { type: 'String' },
        description: { type: 'String' },
        status: { type: 'String' },
        maxInactiveHour: { type: 'int' },
    },
} as const;

export const TicketType = {
    type: 'object',
    properties: {
        ticketTypeId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },

        name: { type: 'String' },
        description: { type: 'String' },
        templateId: { type: 'long' },
        workflowId: { type: 'long' },
        serviceContractIds: { type: 'String' },
        ticketQueueId: { type: 'long' },
        status: { type: 'String' },
    },
} as const;

export const Ticket = {
    type: 'object',
    properties: {
        ticketId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },

        priority: { type: 'String' },
        position: { type: 'int' },
        severity: { type: 'String' },
        resolution: { type: 'String' },
        affectedSystem: { type: 'String' },
        location: { type: 'String' },
        fromName: { type: 'String' },
        fromAddress: { type: 'String' },
        subject: { type: 'String' },
        ticketTypeId: { type: 'long' },
        ticketQueueId: { type: 'long' },
        templateId: { type: 'long' },
        channel: { type: 'String' },
        stageId: { type: 'long' },
        uniqueId: { type: 'String' },
        actionedBy: { type: 'long' },
        actionedTime: { type: 'Date' },
        waitingFor: { type: 'String' },
        remarks: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const TicketThread = {
    type: 'object',
    properties: {
        ticketThreadId: { type: 'long' },

        companyId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },

        ticketUniqueId: { type: 'String' },
        type: { type: 'String' },
        channel: { type: 'String' },
        fromAddress: { type: 'String' },
        fromName: { type: 'String' },
        toAddress: { type: 'String' },
        toName: { type: 'String' },
        subject: { type: 'String' },
        body: { type: 'String' },
        bodyHtml: { type: 'String' },
        submitted: { type: 'Date' },
        responded: { type: 'Date' },
        tryCount: { type: 'Long' },
        actionedBy: { type: 'long' },
        actionedTime: { type: 'Date' },
        status: { type: 'String' },
    },
} as const;

export const TicketMerge = {
    type: 'object',
    properties: {
        mergeId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },

        oldTicketId: { type: 'long' },
        newTicketId: { type: 'long' },
        status: { type: 'String' },
    },
} as const;

export const CallLog = {
    type: 'object',
    properties: {
        callLogId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },

        ownerType: { type: 'String' },
        ownerId: { type: 'long' },
        accountNo: { type: 'String' },
        affectedItem: { type: 'String' },
        service: { type: 'String' },
        category: { type: 'String' },
        subject: { type: 'String' },
        description: { type: 'String' },
        phone: { type: 'String' },
        countryCode: { type: 'String' },
        stateCode: { type: 'String' },
        ext: { type: 'String' },
        language: { type: 'String' },

        assignedBy: { type: 'long' },
        assignedTime: { type: 'Date' },
        actionedBy: { type: 'long' },
        actionedTime: { type: 'Date' },
    },
} as const;

export const Project = {
    type: 'object',
    properties: {
        projectId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },

        uniqueId: { type: 'String' },
        projectOwner: { type: 'long' },
        projectSponsor: { type: 'long' },
        name: { type: 'String' },
        description: { type: 'String' },
        startTime: { type: 'Date' },
        endTime: { type: 'Date' },
        dueDate: { type: 'Date' },
        remarks: { type: 'String' },
        serviceContractIds: { type: 'String' },
        state: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const Task = {
    type: 'object',
    properties: {
        taskId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },

        ownerType: { type: 'String' },
        ownerId: { type: 'long' },
        parentTaskId: { type: 'long' },
        predecessorTaskId: { type: 'long' },
        taskType: { type: 'String' },
        name: { type: 'String' },
        description: { type: 'String' },
        startTime: { type: 'Date' },
        endTime: { type: 'Date' },
        dueDate: { type: 'Date' },
        stageId: { type: 'long' },
        classificationId: { type: 'long' },
        serviceContractIds: { type: 'String' },
        actionedBy: { type: 'long' },
        actionedTime: { type: 'Date' },
        remarks: { type: 'String' },
        progress: { type: 'int' },
        settings: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const TaskDependency = {
    type: 'object',
    properties: {
        taskDependencyId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },

        taskId: { type: 'long' },
        dependentTaskId: { type: 'long' },
    },
} as const;

export const TaskAction = {
    type: 'object',
    properties: {
        taskActionId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },

        taskId: { type: 'long' },
        name: { type: 'String' },
        description: { type: 'String' },
        progress: { type: 'int' },
        trigger: { type: 'String' },
        type: { type: 'String' },
        state: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const ItemClassificaiton = {
    type: 'object',
    properties: {
        itemClassificationId: { type: 'long' },

        companyId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        groupId: { type: 'long' },

        ownerType: { type: 'String' },
        ownerId: { type: 'long' },
        name: { type: 'String' },
        description: { type: 'String' },
        position: { type: 'String' },
        isEndFinal: { type: 'boolean' },
    },
} as const;

export const Equipment = {
    type: 'object',
    properties: {
        equipmentId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },

        name: { type: 'String' },
        type: { type: 'String' },
        category: { type: 'String' },
        location: { type: 'String' },
        modelId: { type: 'String' },
        brandId: { type: 'String' },
        serialNo: { type: 'String' },
        options: { type: 'String' },
        tag: { type: 'String' },
        warranty: { type: 'String' },
        color: { type: 'String' },
        cost: { type: 'String' },
        currency: { type: 'String' },
        assignedTo: { type: 'String' },
        departmentId: { type: 'String' },
        supplierId: { type: 'String' },
        acquiredBy: { type: 'String' },
        acquiredDate: { type: 'String' },
        remarks: { type: 'String' },
        status: { type: 'String' },
        fleetVehicleId: { type: 'long' },
        tagId: { type: 'long' },
        vinNo: { type: 'String' },
        acquisitionDate: { type: 'String' },
        licensePlate: { type: 'String' },
        driverId: { type: 'long' },
        co2: { type: 'String' },
        value: { type: 'double' },
        doors: { type: 'int' },
        year: { type: 'String' },
        odometer: { type: 'String' },
        seats: { type: 'String' },
        horsepower: { type: 'String' },
        engineSize: { type: 'String' },
        capacity: { type: 'String' },
        emission: { type: 'String' },
        fuelType: { type: 'String' },
        state: { type: 'String' },
    },
} as const;

export const EquipmentConsumable = {
    type: 'object',
    properties: {
        equipmentConsumableId: { type: 'long' },

        companyId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        groupId: { type: 'long' },

        approvedBy: { type: 'long' },
        checkedBy: { type: 'long' },
        executedBy: { type: 'long' },
        requestBy: { type: 'long' },
        equipmentId: { type: 'String' },
        type: { type: 'String' },
        amount: { type: 'double' },
        cost: { type: 'double' },
        pricePerUnit: { type: 'double' },
        usedreading: { type: 'double' },
        remarks: { type: 'String' },
        status: { type: 'String' },
        fleetVehicleFuelId: { type: 'long' },


        vehicleId: { type: 'long' },
        vendorId: { type: 'long' },
        liter: { type: 'double' },
        pricePerLiter: { type: 'double' },
        odometer: { type: 'double' },
        fuelType: { type: 'String' },
    },
} as const;

export const EquipmentRequest = {
    type: 'object',
    properties: {
        equipmentRequestId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },

        approvedBy: { type: 'long' },
        checkedBy: { type: 'long' },
        executedBy: { type: 'long' },
        requestBy: { type: 'long' },
        equipmentId: { type: 'String' },
        options: { type: 'String' },
        priority: { type: 'int' },
        description: { type: 'String' },
        remarks: { type: 'String' },
        status: { type: 'String' },
    },
} as const;


export const Tag = {
    type: 'object',
    properties: {
        tagId: { type: 'long' },

        companyId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        groupId: { type: 'long' },

        assignedBy: { type: 'long' },
        checkedBy: { type: 'long' },
        assignedToType: { type: 'String' },
        assignedTo: { type: 'long' },
        assignedDate: { type: 'Date' },
        serial: { type: 'long' },
        key: { type: 'String' },
        type: { type: 'String' },
        balance: { type: 'double' },
        status: { type: 'String' },
    },
} as const;

export const TagLog = {
    type: 'object',
    properties: {
        tagLogId: { type: 'long' },

        companyId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        groupId: { type: 'long' },

        tagId: { type: 'long' },
        readerId: { type: 'long' },
        oldValue: { type: 'String' },
        value: { type: 'String' },
        remarks: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const TagReader = {
    type: 'object',
    properties: {
        tagReaderId: { type: 'long' },

        companyId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        groupId: { type: 'long' },

        deployedBy: { type: 'long' },
        checkedBy: { type: 'long' },
        deployedDate: { type: 'Date' },
        location: { type: 'String' },
        serial: { type: 'long' },
        key: { type: 'String' },
        type: { type: 'String' },
        remarks: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const Maintenance = {
    type: 'object',
    properties: {
        maintenanceId: { type: 'long' },

        companyId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        groupId: { type: 'long' },

        ownerId: { type: 'long' },
        ownerType: { type: 'long' },
        approvedBy: { type: 'long' },
        checkedBy: { type: 'long' },
        executedBy: { type: 'long' },
        requestBy: { type: 'long' },
        vendorId: { type: 'long' },
        maintenanceType: { type: 'String' },
        cost: { type: 'double' },
        odometer: { type: 'String' },
        remarks: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const MaintenanceCheck = {
    type: 'object',
    properties: {
        maintenanceCheckId: { type: 'long' },

        companyId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        groupId: { type: 'long' },

        ownerId: { type: 'long' },
        ownerType: { type: 'String' },
        checkType: { type: 'String' },
        checkValue: { type: 'String' },
    },
} as const;

export const ServiceContract = {
    type: 'object',
    properties: {
        serviceContractId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },

        name: { type: 'String' },
        description: { type: 'String' },
        startOn: { type: 'String' },
        stopOn: { type: 'String' },
        pauseOn: { type: 'String' },
        goals: { type: 'String' },
        calendarType: { type: 'String' },
        param: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const TimeEstimate = {
    type: 'object',
    properties: {
        timeEstimateId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },

        name: { type: 'String' },
        description: { type: 'String' },
        miniutes: { type: 'int' },
        status: { type: 'String' },
    },
} as const;

export const TimeLog = {
    type: 'object',
    properties: {
        timeLogId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },

        ownerType: { type: 'String' },
        ownerId: { type: 'long' },
        serviceContractId: { type: 'long' },
        subject: { type: 'String' },
        description: { type: 'String' },
        startTime: { type: 'Date' },
        endTime: { type: 'Date' },
        dueDate: { type: 'Date' },
        isBillable: { type: 'boolean' },
        remarks: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const Stage = {
    type: 'object',
    properties: {
        stageId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },

        name: { type: 'String' },
        description: { type: 'String' },
        ownerType: { type: 'String' },
        ownerId: { type: 'long' },
        position: { type: 'int' },
        stageType: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const Assignment = {
    type: 'object',
    properties: {
        assignmentId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },

        ownerType: { type: 'String' },
        ownerId: { type: 'long' },
        assignedBy: { type: 'long' },
        assignedTo: { type: 'String' },
        assignedToId: { type: 'long' },
        assignedTime: { type: 'Date' },
        param: { type: 'String' },
        remarks: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const RelatedItem = {
    type: 'object',
    properties: {
        relatedItemId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },

        ownerType: { type: 'String' },
        ownerId: { type: 'long' },
        itemType: { type: 'String' },
        itemId: { type: 'long' },
        param: { type: 'String' },
    },
} as const;

export const Comment = {
    type: 'object',
    properties: {
        commentId: { type: 'long' },

        companyId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        groupId: { type: 'long' },
        remoteAppId: { type: 'long' },

        messageType: { type: 'String' },
        ownerType: { type: 'String' },
        ownerId: { type: 'long' },
        title: { type: 'String' },
        content: { type: 'String' },
    },
} as const;
