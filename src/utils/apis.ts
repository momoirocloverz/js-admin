import Instance from './axios';
class APIs {
  // static getBanner(params?: any) {
  //   return Instance.get('admins/attract_investment/list', {
  //     params,
  //   });
  // }

  static adminLogin(data?: any) {
    return Instance.post('/admin/login', data);
  }
  static adminLogout(data?: any) {
    return Instance.post('/admin/logout', data);
  }
  static adminModifyPassword(data?: any) {
    return Instance.post('/admin/modify_password', data);
  }
  static modifyListPassword(data?: any) {
    return Instance.post('/admin/modify_list_password', data);
  }
  static getAdminInfo(data?: any) {
    return Instance.post('/admin/get_admin_info', data);
  }
  static fetchAttractInvestmentList(data?: any) {
    return Instance.post('/attract_investment/list', data);
  }
  static fetchAttractInvestmentInfo(data?: any) {
    return Instance.post('/attract_investment/info', data);
  }
  static fetchAttractInvestmentDel(data?: any) {
    return Instance.post('/attract_investment/del', data);
  }
  static attractInvestmentAdd(data?: any) {
    return Instance.post('/attract_investment/add', data);
  }
  static attractInvestmentEdit(data?: any) {
    return Instance.post('/attract_investment/edit', data);
  }
  static fetchAttractCategoryList(data?: any) {
    return Instance.post('/attract_category/list', data);
  }
  static fetchAttractCategoryDel(data?: any) {
    return Instance.post('/attract_category/del', data);
  }
  static fetchAttractCategoryAdd(data?: any) {
    return Instance.post('/attract_category/add', data);
  }
  static attractPutaway(data?: any) {
    return Instance.post('/attract_investment/put_away', data);
  }
  static fetchUnderstandPaperList(data?: any) {
    return Instance.post('/understand_paper/list', data);
  }
  static fetchUnderstandPaperDel(data?: any) {
    return Instance.post('/understand_paper/del', data);
  }
  static fetchUnderstandPaperInfo(data?: any) {
    return Instance.post('/understand_paper/info', data);
  }
  static understandPaperAdd(data?: any) {
    return Instance.post('/understand_paper/add', data);
  }
  static understandPaperEdit(data?: any) {
    return Instance.post('/understand_paper/edit', data);
  }
  static fetchUnderstandCategoryList(data?: any) {
    return Instance.post('/understand_category/list', data);
  }
  static understandPutaway(data?: any) {
    return Instance.post('/understand_paper/put_away', data);
  }
  static understandCategoryAdd(data?: any) {
    return Instance.post('/understand_category/add', data);
  }
  static understandCategoryDel(data?: any) {
    return Instance.post('/understand_category/del', data);
  }
  static fetchAdminList(data?: any) {
    return Instance.post('/policy_document/admin_list', data);
  }
  static fetchPolicyDocumentList(data?: any) {
    return Instance.post('/policy_document/list', data);
  }
  static fetchPolicyDocumentAllList(data?: any) {
    return Instance.post('/policy_document/all_list', data);
  }
  static fetchPolicyDocumentDel(data?: any) {
    return Instance.post('/policy_document/del', data);
  }
  static fetchPolicyDocumentInfo(data?: any) {
    return Instance.post('/policy_document/info', data);
  }
  static policyDocumentAdd(data?: any) {
    return Instance.post('/policy_document/add', data);
  }
  static policyDocumentEdit(data?: any) {
    return Instance.post('/policy_document/edit', data);
  }
  static fetchPolicyCategoryList(data?: any) {
    return Instance.post('/policy_category/list', data);
  }
  static policyCategoryAdd(data?: any) {
    return Instance.post('/policy_category/add', data);
  }
  static policyCategoryDel(data?: any) {
    return Instance.post('/policy_category/del', data);
  }
  static policyPutaway(data?: any) {
    return Instance.post('/policy_document/put_away', data);
  }
  static uploadImages(data?: any) {
    return Instance.post('/upload/upload_images', data);
  }
  static projectList(data?: any) {
    return Instance.post('/project/get_list', data);
  }
  static fetchProjectDetail(data?: any) {
    return Instance.post('/project/detail', data);
  }
  static fetchDeclarationHistoryDetail(data?: any) {
    return Instance.post('/project/view_declaration_history_detail', data);
  }
  static fetchImplementPlanHistoryDetail(data?: any) {
    return Instance.post(
      '/project/view_project_implement_plan_history_detail',
      data,
    );
  }
  static actionProject(data?: any) {
    return Instance.post('/project/action_project', data);
  }
  static fetchDeclarationRecordList(data?: any) {
    return Instance.post('/project/project_declaration_record_list', data);
  }
  static fetchFacilityHistoryList(data?: any) {
    return Instance.post(
      '/project/view_project_facility_list_history_detail',
      data,
    );
  }
  static noticeBoardList(data?: any) {
    return Instance.post('/notice_board/list', data);
  }
  static noticeBoardInfo(data?: any) {
    return Instance.post('/notice_board/info', data);
  }
  static noticeBoardAdd(data?: any) {
    return Instance.post('/notice_board/add', data);
  }
  static noticeBoardEdit(data?: any) {
    return Instance.post('/notice_board/edit', data);
  }
  static noticeBoardEditStatus(data?: any) {
    return Instance.post('/notice_board/edit_status', data);
  }
  static projectFundSourceList(data?: any) {
    return Instance.post('/project_fund_source/get_list', data);
  }
  static projectFundSourceAction(data?: any) {
    return Instance.post('/project_fund_source/action', data);
  }
  static projectFundSourceInfo(data?: any) {
    return Instance.post('/project_fund_source/get_info', data);
  }
  static projectFundSourceRemove(data?: any) {
    return Instance.post('/project_fund_source/remove', data);
  }
  static getFundRemainInfo(data?: any) {
    return Instance.post('/project_fund_source/get_remain_amount', data);
  }
  // 添加、编辑资金分项
  static updateFundSubItem(data?: any) {
    return Instance.post('/fund_subitem/action', data);
  }
  // 删除资金分项
  static deleteFundSubItem(data?: any) {
    return Instance.post('/fund_subitem/remove', data);
  }
  // 获取资金分项列表（分页）
  static getFundSubItemList(data?: any) {
    return Instance.post('/fund_subitem/get_list', data);
  }
  // 资金来源分项列表--以资金来源分项维度
  static getFundSubItemListBySubItem(data?: any) {
    return Instance.post('project_fund_source/get_subitem_list', data);
  }
  // 获取指定关联资金分项的剩余金额
  static getRelSubItemRemainInfo(data?: any) {
    return Instance.post(
      '/project_fund_source/get_rel_subitem_remain_amount',
      data,
    );
  }
  static noticeBoardDel(data?: any) {
    return Instance.post('/notice_board/del', data);
  }
  static noticeBoardCategoryList(data?: any) {
    return Instance.post('/notice_board_category/list', data);
  }
  static noticeBoardCategoryAdd(data?: any) {
    return Instance.post('/notice_board_category/add', data);
  }
  static noticeBoardCategoryDel(data?: any) {
    return Instance.post('/notice_board_category/del', data);
  }
  static projectAllProjectList(data?: any) {
    return Instance.post('/project/get_all_project_list', data);
  }
  static getRoleTypeList(data?: any) {
    return Instance.post('/role/get_role_type_list', data);
  }
  static areaGetTownList(data?: any) {
    return Instance.post('/area/get_town_list', data);
  }
  static homePageList(data?: any) {
    return Instance.post('/home_page/list', data);
  }
  static getHomePageJzList(data?: any) {
    return Instance.post('/home_page/jz_project_list', data);
  }
  static homePageUserActivation(data?: any) {
    return Instance.post('/home_page/user_activation', data);
  }
  static homePagegetTownProjectList(data?: any) {
    return Instance.post('/home_page/get_click_map_town_project_list', data);
  }
  static homeEditProjectAnalyse(data?: any) {
    return Instance.post('/home_page/edit_project_analyse', data);
  }

  static projectTodoList(data?: any) {
    return Instance.post('/project_todo/get_list', data);
  }
  static projectTodomarkSolve(data?: any) {
    return Instance.post('/project_todo/mark_project_todo_solve', data);
  }
  static projectReserveList(data?: Object) {
    return Instance.post('/project_reserve/get_list', data);
  }
  static fetchProjectReserveExport(params?: any) {
    return Instance({
      url: `/project_reserve/get_list`,
      method: 'get',
      responseType: 'blob',
      params,
    });
  }
  static exportFinancialDistribution_list(params?: any) {
    return Instance({
      url: `/home_page/export_financial_distribution_list`,
      method: 'post',
      responseType: 'blob',
      params,
    });
  }
  static projectReserveDetail(data?: Object) {
    return Instance.post('/project_reserve/detail', data);
  }

  // 删除项目储备
  static deleteProjectReserve(data?: Object) {
    return Instance.post('/project_reserve/remove', data);
  }

  // 修改项目储备的项目类型
  static updateProjectType(data?: Object) {
    return Instance.post('/project_reserve/modify_project_type', data);
  }
  static projectReserveTransferToFm(data?: Object) {
    return Instance.post('/project_reserve/transfer_to_fm', data);
  }
  static projectReserveExecFm(data?: Object) {
    return Instance.post('/project_fm/exec_fm', data);
  }
  static singleProjectReserveExport(data?: any) {
    return Instance({
      url: `/project_reserve/export_detail`,
      method: 'post',
      responseType: 'blob',
      data,
    });
  }
  static fetchUnderstandPaperAllList(data?: Object) {
    return Instance.post('/understand_paper/all_list', data);
  }
  static fetchAreaList(data?: Object) {
    return Instance.post('/area/get_area_list', data);
  }
  static fetchProjectSubList(data?: any) {
    return Instance.post('/project_sub/get_list', data);
  }
  static exportProjectSubList(data?: any) {
    return Instance({
      url: `/project_sub/get_list`,
      method: 'post',
      responseType: 'blob',
      data,
    });
  }
  static projectAction(data?: any) {
    return Instance.post('/project_sub/action_project', data);
  }
  static fetchProjectSubDetail(data?: any) {
    return Instance.post('/project_sub/detail', data);
  }
  static projectSubAction(data?: any) {
    return Instance.post('/project_sub/action_project', data);
  }
  static projectSubBatchAction(data?: any) {
    return Instance.post('/project_sub/batch_action_project', data);
  }

  static getPolicyDocumentXdzjzs(data?: any) {
    return Instance.post(
      '/home_page/get_policy_document_by_click_xdzjzs',
      data,
    );
  }

  static getPolicyDocumentClickYxdje(data?: any) {
    return Instance.post(
      '/home_page/get_policy_document_list_by_click_yxdje',
      data,
    );
  }
  static getPolicyDocumentClickZjlyze(data?: any) {
    return Instance.post(
      '/home_page/get_project_fund_source_list_by_click_zjlyze',
      data,
    );
  }
  static getProjectListClickPh(data?: any) {
    return Instance.post(
      '/home_page/get_hp_project_list_by_click_hpzc_item',
      data,
    );
  }
  static projectCapitalSourceList(data?: any) {
    return Instance.post('/project_capital_source/get_list', data);
  }
  static projectCapitalSourceInfo(data?: any) {
    return Instance.post('/project_capital_source/get_info', data);
  }
  static projectCapitalSourceRemove(data?: any) {
    return Instance.post('/project_capital_source/remove', data);
  }
  static projectCapitalSourceAction(data?: any) {
    return Instance.post('/project_capital_source/action', data);
  }
  static projectCapitalSourceRemoveSubitem(data?: any) {
    return Instance.post('/project_capital_source/remove_subitem', data);
  }
  static checkCanModifyProjectCapitalSource(data?: any) {
    return Instance.post(
      '/policy_document/check_can_modify_project_capital_source',
      data,
    );
  }

  static getProjectClickYdhzj(data?: any) {
    return Instance.post('/home_page/get_project_list_by_click_ydhzj', data);
  }
  // 获取项目维度根据资金来源约束的数据
  static getProjectTableData(data?: any) {
    return Instance.post(
      '/home_page/get_project_list_by_click_zjly_item',
      data,
    );
  }
  // 浙政钉相关

  static adminLoginZzd(data?: any) {
    return Instance.post('/admin/login_zzd_gzt', data);
  }

  static zzdAccessToken(data?: any) {
    return Instance.post('/zhezd/get_access_token', data);
  }

  static zzdUserInfo(data?: any) {
    return Instance.post('/zzd/userInfo', data);
  }

  static zzdTicket(data?: any) {
    return Instance.post('/zhezd/get_jsapi_ticket', data);
  }

  static zzdAuthUserInfo(data?: any) {
    return Instance.post('/zhezd/get_dingtalk_app_user_info', data);
  }
  //明白纸推送--保存
  static understandPaperPushAction(data?: any) {
    return Instance.post('/understand_paper_push/action', data);
  }
  //明白纸推送--执行推送
  static understandPaperPush(data?: any) {
    return Instance.post('/understand_paper_push/push', data);
  }
  //明白纸推送--详情
  static understandPaperGetInfo(data?: any) {
    return Instance.post('/understand_paper_push/get_info', data);
  }
  static modifyProjectBaseinfoByUnitAudit(data?: any) {
    return Instance.post(
      '/project/modify_project_baseinfo_by_unit_audit',
      data,
    );
  }
  static projectSubDownloadLyAuditTable(data?: any) {
    // return Instance.post('/project_sub/download_ly_audit_table', data);
    return Instance({
      url: `/project_sub/download_ly_audit_table`,
      method: 'post',
      responseType: 'blob',
      data,
    });
  }
  static projectFmInfo(data?: any) {
    return Instance.post('/project_fm/get_info', data);
  }
  static projectFmList(data?: any) {
    return Instance.post('/project_fm/get_list', data);
  }
  static projectFmFirstList(data?: any) {
    return Instance.post('/project_fm/get_first_list', data);
  }
  static projectFmAudit(data?: any) {
    return Instance.post('/project_fm/audit', data);
  }
  static projectFmRemove(data?: any) {
    return Instance.post('/project_fm/remove', data);
  }
  static projectFmgetInfoApplyList(data?: any) {
    return Instance.post('/project_fm/get_info_apply_list', data);
  }
  static projectFmgetInfoSxList(data?: any) {
    return Instance.post('/project_fm/get_info_sx_list', data);
  }
  static projectFmInfoByXmdm(data?: any) {
    return Instance.post('/project_fm/get_fm_info_by_xmdm', data);
  }
  static projectFmAdd(data?: any) {
    return Instance.post('/project_fm/add', data);
  }
  static projectFmFilePath(data?: any) {
    return Instance.post('/project_fm/get_file_path', data);
  }
  static investTagList(data?: any) {
    return Instance.post('/invest_tag/get_list', data);
  }
  static investCategoryFirstLevelList(data?: any) {
    return Instance.post('/invest_category/get_first_level_list', data);
  }
  static investCategorySecondLevelList(data?: any) {
    return Instance.post('/invest_category/get_second_level_list', data);
  }
  static investTagAdd(data?: any) {
    return Instance.post('/invest_tag/add', data);
  }
  static investTagModify(data?: any) {
    return Instance.post('/invest_tag/modify', data);
  }
  static investTagRemove(data?: any) {
    return Instance.post('/invest_tag/remove', data);
  }
  static investCategoryList(data?: any) {
    return Instance.post('/invest_category/get_list', data);
  }
  static investCategoryRemove(data?: any) {
    return Instance.post('/invest_category/remove', data);
  }
  static investCategoryAction(data?: any) {
    return Instance.post('/invest_category/action', data);
  }
  static investBsydList(data?: any) {
    return Instance.post('/invest_bsyd/get_list', data);
  }
  static investBsydAdd(data?: any) {
    return Instance.post('/invest_bsyd/add', data);
  }
  static investBsydModify(data?: any) {
    return Instance.post('/invest_bsyd/modify', data);
  }
  static investBsydRemove(data?: any) {
    return Instance.post('/invest_bsyd/remove', data);
  }
}
interface APIs {}
export default APIs;
