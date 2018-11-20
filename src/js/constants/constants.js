/**
 * Single source of truth for various constants needed
 * allows changes to names, variables, without worrying about
 * breaking everything.
 */

export default {
    accounts: {
        ADMIN: "admin",
        EXECUTIVE: "executive"
    },
    modals: {
        EDITING: "Editing",
        CREATING: "Creating"
    },
    variability: {
        EXECUTIVE: "executive",
        MEMBER: "member"
    },
    reservations: {
        status: {
            "REQUESTED": "REQUESTED",
            "APPROVED": "APPROVED",
            "PAID": "PAID",
            "TAKEN": "TAKEN",
            "RETURNED": "RETURNED",
            "CANCELLED": "CANCELLED"
        }
    }
};
