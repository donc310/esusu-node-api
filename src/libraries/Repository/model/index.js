import {
    Model
} from "objection"
import {
    src_path
} from '../../../helpers/core.helper';

export default class BaseModel extends Model {
    static get idColumn() {
        return "id"
    }
    static get defaultSortBy() {
        return "created_at"
    }
    static get modelPaths() {
        return [
            src_path("app/models"),
            src_path("app/models/app")
        ];
    }
    static get modifiers() {
        const modifiers = {
            filterStatus(builder, status) {
                builder.where('status', status);
            },
            filterEnabled(builder, status) {
                builder.where('enabled', status)
            },
            filterDeleted(builder, status) {
                builder.where('is_deleted', status);
            },
            filterNoDeleted(builder) {
                builder.where('is_deleted', false)
            },
        };
        return Object.assign({}, super.modifiers, modifiers)
    }
}