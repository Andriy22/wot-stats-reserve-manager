
<template>
  <div>
  <v-card>
    <v-toolbar flat>

      <v-toolbar-title class="fill-height">Reserve management <b>{{$store.state.connectedAccounts.find(x=>x.id == $route.params.id)?.clan.split(' ')[0]}}</b>


      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn @click="settingsDialog = true" icon>
        <v-icon>mdi-cogs</v-icon>
      </v-btn>

      <v-btn @click="dialog = true" icon>
        <v-icon color="pink">mdi-plus</v-icon>
      </v-btn>



      <template v-slot:extension>

        <v-tabs
            v-model="tabs"
            fixed-tabs
            @change="onTabChange"
        >
          <v-tabs-slider :color="$store.state.colors.primary"></v-tabs-slider>
          <v-tab
              href="#dayofweek-1"
              class="pink--text"

          >
            Mon
          </v-tab>

          <v-tab
              href="#dayofweek-2"
              class="pink--text"

          >
            Tue
          </v-tab>
          <v-tab
              href="#dayofweek-3"
              class="pink--text"

          >
            Wed
          </v-tab>
          <v-tab
              href="#dayofweek-4"
              class="pink--text"

          >
            Thu
          </v-tab>
          <v-tab
              href="#dayofweek-5"
              class="pink--text"

          >
            Fri
          </v-tab>
          <v-tab
              href="#dayofweek-6"
              class="pink--text"

          >
            Sat
          </v-tab>
          <v-tab
              href="#dayofweek-0"
              class="pink--text"

          >
            Sun
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <v-tabs-items v-model="tabs">
      <v-tab-item

          v-for="i in 7"
          :key="i-1"
          :value="'dayofweek-' + (i-1)"
      >
        <v-card flat>
          <v-card-text>

            <v-data-table
                :headers="headers"
                :items="$store.state.clanReserves.list"
                disable-pagination
                class="elevation-4"
            >
              <template v-slot:item.actions="{ item }">
                <v-icon
                    small
                    class="mr-2"
                    color="orange"
                    disabled
                >
                  mdi-pencil
                </v-icon>

                <v-icon
                    small
                    class="mr-2"
                    @click="remove(item)"
                    color="red"
                >
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>

    <v-row justify="center">
      <v-dialog
          v-model="dialog"
          persistent
          max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Add reserve</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col
                    cols="12"
                >
                  <v-select
                      :items="[{text: 'Дополнительный инструктаж', value: 'ADDITIONAL_BRIEFING'},
                               {text: 'Военные учения', value: 'MILITARY_MANEUVERS'},
                               {divider: true},
                               {text: 'Тактическая подготовка', value: 'TACTICAL_TRAINING'},
                               {text: 'Боевые выплаты', value: 'BATTLE_PAYMENTS'},]"
                      label="Reserve type"
                      :color="$store.state.colors.primary"
                      :item-color="$store.state.colors.primary"
                      v-model="selectedType"
                      @change="onReserveTypeChanged"
                      required
                  ></v-select>
                </v-col>
                <v-col
                    cols="12"
                >
                  <v-select
                      :items="$store.state.clanReserves.levels"
                      label="Reserve level"
                      :color="$store.state.colors.primary"
                      :item-color="$store.state.colors.primary"
                      v-model = "selectedLevel"
                      required
                  ></v-select>
                </v-col>

                <v-col
                    cols="12"
                >
                  <v-select
                      label="Time"
                      :items="times"
                      :color="$store.state.colors.primary"
                      :item-color="$store.state.colors.primary"
                      v-model = "selectedTime"
                      required
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="gray darken-1"
                text
                @click="dialog = false"
            >
              Close
            </v-btn>
            <v-btn
                color="pink darken-1"
                text
                @click="onDataSubmit"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
          v-model="settingsDialog"
          persistent
          max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Settings</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col
                    cols="12"
                >
                  <v-select
                      :items="timezones"
                      @change="onTimeZoneChanged"
                      :value = "$store.state.clanReserves.timeZone"
                      :color = "$store.state.colors.primary"
                      :item-color = "$store.state.colors.primary"
                      label="Time Zone"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="gray darken-1"
                text
                @click="settingsDialog = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>

</template>

<script>
export default {
  name: "EditorView.vue",
  data () {
    return {
      tabs: null,
      dialog: false,
      settingsDialog: false,
      selectedType: 'BATTLE_PAYMENTS',
      selectedLevel: 1,
      selectedTime: 1,
      times: [],
      timezones: [],
      headers: [
        {
          text: 'Reserve type',
          align: 'start',
          sortable: false,
          value: 'reserveType',
        },
        { text: 'Reserve level', value: 'reserveLevel' },
        { text: 'Activate at', value: 'hour' },
        { text: 'Min online', value: 'online' },
        { text: 'Actions', value: 'actions' },
      ],
    }
  },
  methods: {
    onTabChange(event) {
      this.$store.dispatch("getClanSchedule", {clanId: this.$route.params.id, day: event[event.length-1]});
    },
    onDataSubmit() {
      if (this.$store.state.clanReserves.levels.find(x=> x===this.selectedLevel)) {
        this.$store.dispatch("addReserveSchedule",{activateAt: this.selectedTime, reserveLevel: this.selectedLevel, reserveType: this.selectedType});
        this.selectedType = "BATTLE_PAYMENTS";
        this.selectedLevel = 1;
        this.selectedTime = 1;
        this.dialog = false;
     }
    },
    remove(item) {
      this.$store.dispatch("removeClanReserveItem", {clanId: this.$route.params.id, id: item.id})
    },
    onReserveTypeChanged(event) {
      this.$store.dispatch("getReserveLevels", event);
      this.selectedLevel = 1;
    },
    onTimeZoneChanged(event) {
      this.$store.dispatch("setClanTimezone", {clanId: this.$route.params.id, timezone: event});
    }
  },
  mounted() {
    this.$store.dispatch("getConnectedAccounts");
    this.$store.dispatch("getReserveLevels", this.selectedType);
    this.$store.dispatch("getClanTimezone", this.$route.params.id)

    for (let i=1;i<=24; i++) {
      this.times.push({
        value:i,
        text: i + ':00'
      });
    }

    for (let i = -12; i<=12;i++) {
      if (i < 0) {
        this.timezones.push({
          value: i,
          text: "UTC - " + i*-1,
        })
      }

      if (i > 0) {
        this.timezones.push({
          value: i,
          text: "UTC + " + i,
        })
      }

      if (i === 0) {
        this.timezones.push({
          value: i,
          text: "UTC",
        })
      }
    }
  },
  watch: {
    '$route.params.id': {
      handler: function(search) {
        this.tabs = 0;
        this.$store.dispatch("getClanSchedule", {clanId: this.$route.params.id, day: 0});
        this.$store.dispatch("getClanTimezone", this.$route.params.id)
      },
      deep: true,
      immediate: true
    }
  },
}
</script>

<style scoped>

</style>
