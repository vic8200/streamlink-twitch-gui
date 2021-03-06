import { getOwner } from "@ember/application";
import { get } from "@ember/object";
import Route from "@ember/routing/route";
import InfiniteScrollMixin from "./mixins/infinite-scroll";
import FilterLanguagesMixin from "./mixins/filter-languages";
import { toArray } from "utils/ember/recordArrayMethods";
import preload from "utils/preload";


export default Route.extend( InfiniteScrollMixin, FilterLanguagesMixin, {
	itemSelector: ".stream-item-component",

	modelName: "twitchStream",

	model() {
		const store = get( this, "store" );
		const model = this.modelFor( "communitiesCommunity" );
		const offset = get( this, "offset" );
		const limit = get( this, "limit" );
		const broadcaster_language = get( this, "broadcaster_language" );
		const community_id = get( model, "id" );

		return store.query( this.modelName, {
			offset,
			limit,
			broadcaster_language,
			community_id
		})
			.then( records => toArray( records ) )
			.then( records => preload( records, "preview.mediumLatest" ) );
	},

	refresh() {
		return getOwner( this ).lookup( "route:communitiesCommunity" ).refresh();
	}
});
