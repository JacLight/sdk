export const Popup = {
    type: 'object',
    properties: {
        popupId: { type: 'long' },



        title: { type: 'String' },
        description: { type: 'String' },
        contentIds: { type: 'String' },
        content: { type: 'String' },
        displayType: { type: 'String' },
        displayProperty: { type: 'String' },
        showTitle: { type: 'boolean' },
        useCookie: { type: 'boolean' },
        showToAll: { type: 'boolean' },
        showAlways: { type: 'boolean' },
        mustConfirm: { type: 'boolean' },
        allowBack: { type: 'boolean' },
        allowReview: { type: 'boolean' },
        timed: { type: 'boolean' },
        duration: { type: 'int' },
        trigger: { type: 'String' },
        expiry: { type: 'Date' },
        status: { type: 'String' },
    },
} as const;

export const PopupItem = {
    type: 'object',
    properties: {
        popupItemId: { type: 'long' },



        popupId: { type: 'long' },
        stageId: { type: 'int' },
        completed: { type: 'boolean' },
        completedDate: { type: 'Date' },
        status: { type: 'String' },
    },
} as const;

export const CannedMessage = {
    type: 'object',
    properties: {
        cannedMessageId: { type: 'long' },

        companyId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        groupId: { type: 'long' },
        remoteAppId: { type: 'long' },

        messageType: { type: 'String' },
        title: { type: 'String' },
        content: { type: 'String' },
        global: { type: 'boolean' },
        status: { type: 'String' },
    },
} as const;

export const BannedVisit = {
    type: 'object',
    properties: {
        bannedVisitId: { type: 'long' },

        companyId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        groupId: { type: 'long' },
        remoteAppId: { type: 'long' },

        banType: { type: 'String' },
        banKey: { type: 'String' },
        sessionId: { type: 'String' },
        remarks: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const Visit = {
    type: 'object',
    properties: {
        visitId: { type: 'long' },



        sessionId: { type: 'String' },
        sourceId: { type: 'String' },

        deviceType: { type: 'String' },
        deviceModel: { type: 'String' },
        deviceBrand: { type: 'String' },
        browser: { type: 'String' },
        browserVersion: { type: 'String' },
        browserLang: { type: 'String' },
        os: { type: 'String' },
        osVersion: { type: 'String' },
        ip: { type: 'String' },
        ipForward: { type: 'String' },
        city: { type: 'String' },
        countryName: { type: 'String' },
        countryCode: { type: 'String' },
        regionCode: { type: 'String' },
        regionName: { type: 'String' },
        zipCode: { type: 'String' },
        latitude: { type: 'String' },
        longitude: { type: 'String' },
        timeZone: { type: 'String' },
        metroCode: { type: 'String' },
        isp: { type: 'String' },
        org: { type: 'String' },
        as: { type: 'String' },

        firstActionTime: { type: 'Date' },
        lastActionTime: { type: 'Date' },
        daysSinceFirst: { type: 'String' },
        countVisits: { type: 'int' },
        duration: { type: 'int' },
        entryURL: { type: 'String' },
        exitURL: { type: 'String' },
        refererURL: { type: 'String' },
        refererType: { type: 'String' },
        rawRequest: { type: 'String' },
        activities: { type: 'String' },
        status: { type: 'String' },
        remarks: { type: 'String' },
    },
} as const;

export const VisitItem = {
    type: 'object',
    properties: {
        visitItemId: { type: 'long' },

        companyId: { type: 'long' },

        visitId: { type: 'long' },
        visitTime: { type: 'long' },
        sessionId: { type: 'String' },

        firstActionTime: { type: 'Date' },
        lastActionTime: { type: 'Date' },
        daysSinceFirst: { type: 'String' },
        countVisits: { type: 'int' },
        duration: { type: 'int' },
        entryURL: { type: 'String' },
        exitURL: { type: 'String' },
        refererURL: { type: 'String' },
        refererType: { type: 'String' },
        rawRequest: { type: 'String' },
        status: { type: 'String' },
        remarks: { type: 'String' },
    },
} as const;

export const ClickMap = {
    type: 'object',
    properties: {
        clickMapId: { type: 'long' },

        companyId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        groupId: { type: 'long' },
        remoteAppId: { type: 'long' },

        visitId: { type: 'long' },
        visitItemId: { type: 'long' },
        sessionId: { type: 'String' },
        mouseX: { type: 'int' },
        mouseY: { type: 'int' },
        button: { type: 'String' },
        layoutId: { type: 'long' },
        refererURL: { type: 'String' },
        clientHref: { type: 'String' },
        status: { type: 'String' },
    },
} as const;

export const Sms = {
    type: 'object',
    properties: {
        smsId: { type: 'long' },



        threadId: { type: 'long' },
        toPhones: { type: 'String' },
        toContacts: { type: 'String' },
        from: { type: 'String' },
        smsStatus: { type: 'String' },
        smsFolder: { type: 'String' },
        header: { type: 'String' },
        replyTo: { type: 'String' },
        body: { type: 'String' },
        flash: { type: 'boolean' },
        merge: { type: 'boolean' },
        received: { type: 'Date' },
        sent: { type: 'Date' },
        reviewed: { type: 'Date' },
        channel: { type: 'String' },
        remarks: { type: 'String' },
        tryCount: { type: 'Long' },
    },
} as const;

export const SmsLog = {
    type: 'object',
    properties: {
        smsLogId: { type: 'long' },



        smsId: { type: 'long' },
        triggerEventId: { type: 'long' },
        queueAlertId: { type: 'long' },
        gatewayId: { type: 'long' },
        coverageId: { type: 'long' },
        countryCode: { type: 'String' },
        providerId: { type: 'long' },
        smsTo: { type: 'String' },
        smsCc: { type: 'String' },
        smsCost: { type: 'Double' },
        billed: { type: 'boolean' },
        header: { type: 'String' },
        content: { type: 'String' },
        rawContent: { type: 'String' },
        messageType: { type: 'String' },
        flash: { type: 'boolean' },
        merge: { type: 'boolean' },
        mergeField: { type: 'String' },
        smsStatus: { type: 'String' },
        smsState: { type: 'String' },
        remarks: { type: 'String' },
        firstTry: { type: 'Date' },
        lastTry: { type: 'Date' },
        nextTry: { type: 'Date' },
        tryCount: { type: 'Long' },
        uniqueId: { type: 'String' },
        messageId: { type: 'String' },
        delivered: { type: 'int' },
        doneDate: { type: 'Date' },
        error: { type: 'String' },
        submitDate: { type: 'Date' },
        free1: { type: 'String' },
        free2: { type: 'String' },
        free3: { type: 'String' },
    },
} as const;

export const SmsResponse = {
    type: 'object',
    properties: {
        smsOutId: { type: 'long' },



        smsId: { type: 'long' },
        messageId: { type: 'String' },
        issent: { type: 'boolean' },
    },
} as const;

export const SmsGateway = {
    type: 'object',
    properties: {
        gatewayId: { type: 'long' },



        name: { type: 'String' },
        description: { type: 'String' },
        host: { type: 'String' },
        port: { type: 'int' },
        sendUrl: { type: 'String' },
        balanceEnquiryUrl: { type: 'String' },
        deliveryReportUrl: { type: 'String' },
        multiRecipientDelimiter: { type: 'String' },
        sourceDelimiter: { type: 'String' },
        username: { type: 'String' },
        password: { type: 'String' },
        deliveryResponse: { type: 'String' },
        sentResponse: { type: 'String' },
        responseCode: { type: 'String' },
        gatewayType: { type: 'String' },
        priority: { type: 'int' },
        maxConn: { type: 'int' },
        connType: { type: 'String' },
        connTimeout: { type: 'int' },
        idleTimeout: { type: 'int' },
        status: { type: 'String' },
        keepAlive: { type: 'boolean' },
    },
} as const;

export const Email = {
    type: 'object',
    properties: {
        emailId: { type: 'long' },



        fromName: { type: 'String' },
        fromAddress: { type: 'String' },
        replyToAddress: { type: 'String' },
        cc: { type: 'String' },
        bcc: { type: 'String' },
        subject: { type: 'String' },
        body: { type: 'String' },
        bodyHtml: { type: 'String' },
        attachFile: { type: 'String' },
        emailType: { type: 'String' },
        threadId: { type: 'long' },
        toEmails: { type: 'String' },
        toContacts: { type: 'String' },
        emailStatus: { type: 'String' },
        emailFolder: { type: 'String' },
        received: { type: 'Date' },
        sent: { type: 'Date' },
        merge: { type: 'boolean' },
        copySelf: { type: 'boolean' },
        reviewed: { type: 'Date' },
        channel: { type: 'String' },
        remarks: { type: 'String' },
        status: { type: 'String' },
        trackOpen: { type: 'boolean' },
        trackClick: { type: 'boolean' },
        trackBounce: { type: 'boolean' },
        trackCompliant: { type: 'boolean' },
        facebook: { type: 'boolean' },
        tweet: { type: 'boolean' },
        tryCount: { type: 'Long' },
    },
} as const;

export const EmailLog = {
    type: 'object',
    properties: {
        emailLogId: { type: 'long' },



        emailId: { type: 'long' },
        fromAddress: { type: 'String' },
        fromName: { type: 'String' },
        toAddress: { type: 'String' },
        toName: { type: 'String' },
        replyToAddress: { type: 'String' },
        subject: { type: 'String' },
        body: { type: 'String' },
        bodyHtml: { type: 'String' },
        attachFile: { type: 'String' },
        htmlFormat: { type: 'boolean' },
        firstTry: { type: 'Date' },
        lastTry: { type: 'Date' },
        nextTry: { type: 'Date' },
        tryCount: { type: 'Long' },
        cost: { type: 'Double' },
        merge: { type: 'boolean' },
        mergeField: { type: 'String' },
        triggerEventId: { type: 'long' },
        gatewayId: { type: 'long' },
        emailStatus: { type: 'String' },
        emailState: { type: 'String' },
        uniqueId: { type: 'String' },
        delivered: { type: 'int' },
        doneDate: { type: 'Date' },
        error: { type: 'String' },
        bounced: { type: 'boolean' },
        bounceType: { type: 'String' },
        clicked: { type: 'boolean' },
        emailClient: { type: 'String' },
        opened: { type: 'boolean' },
        share: { type: 'boolean' },
        spam: { type: 'boolean' },
        unsubscribed: { type: 'boolean' },
        remarks: { type: 'String' },
        free1: { type: 'String' },
        free2: { type: 'String' },
        free3: { type: 'String' },
    },
} as const;

export const EmailGateway = {
    type: 'object',
    properties: {
        gatewayId: { type: 'long' },



        name: { type: 'String' },
        serverType: { type: 'String' },
        description: { type: 'String' },
        outgoingName: { type: 'String' },
        outgoingType: { type: 'String' },
        outgoingPort: { type: 'int' },
        outgoingAuthentication: { type: 'boolean' },
        outgoingUsername: { type: 'String' },
        outgoingPassword: { type: 'String' },
        incomingName: { type: 'String' },
        incomingType: { type: 'String' },
        incomingPort: { type: 'int' },
        incomingAuthentication: { type: 'boolean' },
        incomingUsername: { type: 'String' },
        incomingPassword: { type: 'String' },
        emailAddress: { type: 'String' },
        secure: { type: 'boolean' },
        connectionType: { type: 'String' },
        cost: { type: 'double' },
        priority: { type: 'int' },
        status: { type: 'String' },
    },
} as const;

export const Link = {
    type: 'object',
    properties: {
        linkId: { type: 'long' },



        emailId: { type: 'long' },
        emailLogId: { type: 'long' },
        uniqueId: { type: 'String' },

        targetURL: { type: 'String' },
        tinyURL: { type: 'String' },
        clicks: { type: 'long' },
        name: { type: 'String' },
        status: { type: 'String' },
        remarks: { type: 'String' },
    },
} as const;

export const LinkItem = {
    type: 'object',
    properties: {
        itemId: { type: 'long' },



        linkId: { type: 'long' },
        emailId: { type: 'long' },
        emailLogId: { type: 'long' },
        visitTime: { type: 'long' },
        sessionId: { type: 'String' },

        emailClient: { type: 'String' },
        deviceType: { type: 'String' },
        deviceModel: { type: 'String' },
        deviceBrand: { type: 'String' },
        browser: { type: 'String' },
        browserVersion: { type: 'String' },
        browserLang: { type: 'String' },
        os: { type: 'String' },
        osVersion: { type: 'String' },
        ip: { type: 'String' },
        ipForward: { type: 'String' },
        city: { type: 'String' },
        country: { type: 'String' },
        latitude: { type: 'String' },
        longitude: { type: 'String' },

        firstActionTime: { type: 'Date' },
        lastActionTime: { type: 'Date' },
        daysSinceFirst: { type: 'String' },
        countVisits: { type: 'int' },
        duration: { type: 'int' },
        entryURL: { type: 'String' },
        exitURL: { type: 'String' },
        refererURL: { type: 'String' },
        refererType: { type: 'String' },
        rawRequest: { type: 'String' },
        activities: { type: 'String' },
        status: { type: 'String' },
        remarks: { type: 'String' },
    },
} as const;
