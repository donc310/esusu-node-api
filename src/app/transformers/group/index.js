import BaseTransformer from "../../../libraries/Repository/transformer"

export class PublicGroupTransformer extends BaseTransformer {
    transform(group) {
        return {
            id: group.id,
            name: group.name,
            uuid: group.uuid,
            is_public: group.is_public,
            description: group.description,
            maximum_member: group.maximum_member,
            savings_amount: group.savings_amount,
        }
    }
}

export class PrivateGroupTransformer extends BaseTransformer{
    transform(){
        return {
            ...group
        }
    }
}
