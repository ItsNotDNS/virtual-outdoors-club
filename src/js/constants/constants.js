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
            PAY_CASH: "PAY_CASH"
        }
    },
    gearConditions: {
        RENTABLE: "RENTABLE",
        FLAGGED: "FLAGGED",
        NEEDS_REPAIR: "NEEDS_REPAIR",
        DELETED: "DELETED"
    }
};

export default constants;
