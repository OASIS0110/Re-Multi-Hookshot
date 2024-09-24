export * from '@minecraft/server';

declare module '@minecraft/server' {
	export interface EntityComponents {
		[EntityAddRiderComponent.componentId]: EntityAddRiderComponent;
		[EntityAgeableComponent.componentId]: EntityAgeableComponent;
		[EntityBreathableComponent.componentId]: EntityBreathableComponent;
		[EntityCanClimbComponent.componentId]: EntityCanClimbComponent;
		[EntityCanFlyComponent.componentId]: EntityCanFlyComponent;
		[EntityCanPowerJumpComponent.componentId]: EntityCanPowerJumpComponent;
		[EntityColorComponent.componentId]: EntityColorComponent;
		[EntityFireImmuneComponent.componentId]: EntityFireImmuneComponent;
		[EntityFloatsInLiquidComponent.componentId]: EntityFloatsInLiquidComponent;
		[EntityFlyingSpeedComponent.componentId]: EntityFlyingSpeedComponent;
		[EntityFrictionModifierComponent.componentId]: EntityFrictionModifierComponent;
		[EntityGroundOffsetComponent.componentId]: EntityGroundOffsetComponent;
		[EntityHealableComponent.componentId]: EntityHealableComponent;
		[EntityHealthComponent.componentId]: EntityHealthComponent;
		[EntityInventoryComponent.componentId]: EntityInventoryComponent;
		[EntityIsBabyComponent.componentId]: EntityIsBabyComponent;
		[EntityIsChargedComponent.componentId]: EntityIsChargedComponent;
		[EntityIsChestedComponent.componentId]: EntityIsChestedComponent;
		[EntityIsDyableComponent.componentId]: EntityIsDyableComponent;
		[EntityIsHiddenWhenInvisibleComponent.componentId]: EntityIsHiddenWhenInvisibleComponent;
		[EntityIsIgnitedComponent.componentId]: EntityIsIgnitedComponent;
		[EntityIsIllagerCaptainComponent.componentId]: EntityIsIllagerCaptainComponent;
		[EntityIsSaddledComponent.componentId]: EntityIsSaddledComponent;
		[EntityIsShakingComponent.componentId]: EntityIsShakingComponent;
		[EntityIsShearedComponent.componentId]: EntityIsShearedComponent;
		[EntityIsStackableComponent.componentId]: EntityIsStackableComponent;
		[EntityIsStunnedComponent.componentId]: EntityIsStunnedComponent;
		[EntityIsTamedComponent.componentId]: EntityIsTamedComponent;
		[EntityItemComponent.componentId]: EntityItemComponent;
		[EntityLavaMovementComponent.componentId]: EntityLavaMovementComponent;
		[EntityLeashableComponent.componentId]: EntityLeashableComponent;
		[EntityMarkVariantComponent.componentId]: EntityMarkVariantComponent;
		[EntityMountTamingComponent.componentId]: EntityMountTamingComponent;
		[EntityMovementAmphibiousComponent.componentId]: EntityMovementAmphibiousComponent;
		[EntityMovementBasicComponent.componentId]: EntityMovementBasicComponent;
		[EntityMovementComponent.componentId]: EntityMovementComponent;
		[EntityMovementFlyComponent.componentId]: EntityMovementFlyComponent;
		[EntityMovementGenericComponent.componentId]: EntityMovementGenericComponent;
		[EntityMovementGlideComponent.componentId]: EntityMovementGlideComponent;
		[EntityMovementHoverComponent.componentId]: EntityMovementHoverComponent;
		[EntityMovementJumpComponent.componentId]: EntityMovementJumpComponent;
		[EntityMovementSkipComponent.componentId]: EntityMovementSkipComponent;
		[EntityMovementSwayComponent.componentId]: EntityMovementSwayComponent;
		[EntityNavigationClimbComponent.componentId]: EntityNavigationClimbComponent;
		[EntityNavigationFloatComponent.componentId]: EntityNavigationFloatComponent;
		[EntityNavigationFlyComponent.componentId]: EntityNavigationFlyComponent;
		[EntityNavigationGenericComponent.componentId]: EntityNavigationGenericComponent;
		[EntityNavigationHoverComponent.componentId]: EntityNavigationHoverComponent;
		[EntityNavigationWalkComponent.componentId]: EntityNavigationWalkComponent;
		[EntityOnFireComponent.componentId]: EntityOnFireComponent;
		[EntityPushThroughComponent.componentId]: EntityPushThroughComponent;
		[EntityRideableComponent.componentId]: EntityRideableComponent;
		[EntityScaleComponent.componentId]: EntityScaleComponent;
		[EntitySkinIdComponent.componentId]: EntitySkinIdComponent;
		[EntityStrengthComponent.componentId]: EntityStrengthComponent;
		[EntityTameableComponent.componentId]: EntityTameableComponent;
		[EntityUnderwaterMovementComponent.componentId]: EntityUnderwaterMovementComponent;
		[EntityVariantComponent.componentId]: EntityVariantComponent;
		[EntityWantsJockeyComponent.componentId]: EntityWantsJockeyComponent;
	}

	export interface BlockComponents {
		[BlockInventoryComponent.componentId]: BlockInventoryComponent;
		[BlockLavaContainerComponent.componentId]: BlockLavaContainerComponent;
		[BlockPistonComponent.componentId]: BlockPistonComponent;
		[BlockPotionContainerComponent.componentId]: BlockPotionContainerComponent;
		[BlockRecordPlayerComponent.componentId]: BlockRecordPlayerComponent;
		[BlockSignComponent.componentId]: BlockSignComponent;
		[BlockSnowContainerComponent.componentId]: BlockSnowContainerComponent;
		[BlockWaterContainerComponent.componentId]: BlockWaterContainerComponent;
	}

	export interface Entity {
		hasComponent<T extends keyof EntityComponents>(componentId: T): boolean;
		getComponent<T extends keyof EntityComponents>(componentId: T): EntityComponents[T];
	}

	export interface Block {
		getComponent<T extends keyof BlockComponents>(componentId: T): BlockComponents[T];
	}

	export interface Player {
		hasComponent<T extends keyof EntityComponents>(componentId: T): boolean;
		getComponent<T extends keyof EntityComponents>(componentId: T): EntityComponents[T];
	}
}