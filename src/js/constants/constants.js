/**
 * Single source of truth for various constants needed
 * allows changes to names, variables, without worrying about
 * breaking everything.
 */

const constants = {
    accounts: {
        ADMIN: "admin",
        EXECUTIVE: "executive"
    },
    modals: {
        EDITING: "Editing",
        CREATING: "Add New"
    },
    variability: {
        EXECUTIVE: "executive",
        MEMBER: "member"
    },
    gear: {
        conditions: {
            RENTABLE: "RENTABLE",
            FLAGGED: "FLAGGED",
            NEEDS_REPAIR: "NEEDS_REPAIR"
        },
        conditionLabels: {
            LOOKS_GOOD: "Looks Good",
            BROKEN: "Broken",
            NEEDS_CHECK: "Should Be Checked Further",
            MISSING: "Not Returned"
        }
    },
    reservations: {
        status: {
            "REQUESTED": "REQUESTED",
            "APPROVED": "APPROVED",
            "PAID": "PAID",
            "TAKEN": "TAKEN",
            "RETURNED": "RETURNED",
            "CANCELLED": "CANCELLED"
        },
        actions: {
            CANCEL: "CANCEL",
            APPROVE: "APPROVE",
            PAY_CASH: "PAY_CASH",
            CHECK_OUT: "CHECK_OUT"
        }
    },
    gearConditions: {
        RENTABLE: "RENTABLE",
        FLAGGED: "FLAGGED",
        NEEDS_REPAIR: "NEEDS_REPAIR",
        DELETED: "DELETED"
    },
    help: {
        introduction: "introduction",
        gear: "gear-page",
        rent: "rent-page",
        reservation: "reservation-page",
        members: "members-page",
        disableSystem: "disable-system-page",
        statistics: "statistics-page",
        systemVariables: "system-variables-page",
        changePassword: "change-password-page"
    }
};

export default constants;
